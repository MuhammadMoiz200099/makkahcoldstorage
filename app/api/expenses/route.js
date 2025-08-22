import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import StockIn from '@/models/StockIn';
import StockOut from '@/models/StockOut';
import { getAuthUser } from '@/lib/auth';
import { startOfMonth, endOfMonth } from 'date-fns';

export async function GET(request) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const month = searchParams.get('month') || new Date().toISOString().slice(0, 7);

    // Parse month and get date range
    const monthDate = new Date(month + '-01');
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);

    // Build match query for search
    const matchQuery = {
      $or: [
        { partyName: { $regex: search, $options: 'i' } },
        { subPartyName: { $regex: search, $options: 'i' } }
      ]
    };

    // Aggregate stock in data
    const stockInAggregation = [
      {
        $match: {
          inwardDate: { $gte: monthStart, $lte: monthEnd },
          ...(search && matchQuery)
        }
      },
      {
        $group: {
          _id: {
            partyName: '$partyName',
            subPartyName: '$subPartyName'
          },
          stockInCount: { $sum: 1 },
          totalCrates: { $sum: '$crates' },
          totalAmount: { $sum: '$rupees' },
          lastTransaction: { $max: '$inwardDate' }
        }
      }
    ];

    // Aggregate stock out data
    const stockOutAggregation = [
      {
        $match: {
          date: { $gte: monthStart, $lte: monthEnd },
          ...(search && matchQuery)
        }
      },
      {
        $group: {
          _id: {
            partyName: '$partyName',
            subPartyName: '$subPartyName'
          },
          stockOutCount: { $sum: 1 },
          lastTransaction: { $max: '$date' }
        }
      }
    ];

    const [stockInData, stockOutData] = await Promise.all([
      StockIn.aggregate(stockInAggregation),
      StockOut.aggregate(stockOutAggregation)
    ]);

    // Combine data by party
    const expenseMap = new Map();

    // Process stock in data
    stockInData.forEach(item => {
      const key = `${item._id.partyName}-${item._id.subPartyName}`;
      expenseMap.set(key, {
        partyName: item._id.partyName,
        subPartyName: item._id.subPartyName,
        stockInCount: item.stockInCount,
        stockOutCount: 0,
        totalCrates: item.totalCrates,
        totalAmount: item.totalAmount,
        lastTransaction: item.lastTransaction
      });
    });

    // Process stock out data
    stockOutData.forEach(item => {
      const key = `${item._id.partyName}-${item._id.subPartyName}`;
      if (expenseMap.has(key)) {
        const existing = expenseMap.get(key);
        existing.stockOutCount = item.stockOutCount;
        existing.lastTransaction = new Date(Math.max(
          new Date(existing.lastTransaction),
          new Date(item.lastTransaction)
        ));
      } else {
        expenseMap.set(key, {
          partyName: item._id.partyName,
          subPartyName: item._id.subPartyName,
          stockInCount: 0,
          stockOutCount: item.stockOutCount,
          totalCrates: 0,
          totalAmount: 0,
          lastTransaction: item.lastTransaction
        });
      }
    });

    // Convert to array and sort
    let expenses = Array.from(expenseMap.values());
    expenses.sort((a, b) => b.totalAmount - a.totalAmount);

    // Apply pagination
    const total = expenses.length;
    const pages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;
    expenses = expenses.slice(skip, skip + limit);

    return NextResponse.json({
      expenses,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    });

  } catch (error) {
    console.error('Get expenses error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}