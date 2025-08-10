import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../../lib/mongodb';
import StockIn from '../../../../models/StockIn';
import StockOut from '../../../../models/StockOut';
import { getAuthUser } from '../../../../lib/auth';
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';

export async function GET(request) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await connectToDatabase();

    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    // Today's metrics
    const [todayStockIn, todayStockOut] = await Promise.all([
      StockIn.aggregate([
        {
          $match: {
            inwardDate: { $gte: todayStart, $lte: todayEnd }
          }
        },
        {
          $group: {
            _id: null,
            totalCrates: { $sum: '$crates' },
            totalRupees: { $sum: '$rupees' },
            count: { $sum: 1 }
          }
        }
      ]),
      StockOut.aggregate([
        {
          $match: {
            date: { $gte: todayStart, $lte: todayEnd }
          }
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    // Monthly metrics
    const [monthlyStockIn, monthlyStockOut] = await Promise.all([
      StockIn.aggregate([
        {
          $match: {
            inwardDate: { $gte: monthStart, $lte: monthEnd }
          }
        },
        {
          $group: {
            _id: null,
            totalCrates: { $sum: '$crates' },
            totalRupees: { $sum: '$rupees' },
            count: { $sum: 1 }
          }
        }
      ]),
      StockOut.aggregate([
        {
          $match: {
            date: { $gte: monthStart, $lte: monthEnd }
          }
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    const kpis = {
      today: {
        stockIn: todayStockIn[0] || { totalCrates: 0, totalRupees: 0, count: 0 },
        stockOut: todayStockOut[0] || { count: 0 }
      },
      monthly: {
        stockIn: monthlyStockIn[0] || { totalCrates: 0, totalRupees: 0, count: 0 },
        stockOut: monthlyStockOut[0] || { count: 0 }
      }
    };

    return NextResponse.json({ kpis });

  } catch (error) {
    console.error('Get KPIs error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}