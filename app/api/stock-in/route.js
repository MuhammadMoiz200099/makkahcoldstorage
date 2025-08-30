import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import StockIn from '@/models/StockIn';
import { getAuthUser } from '@/lib/auth';
import { format } from 'date-fns';

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
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build search query
    const query = {};
    if (search) {
      query.$or = [
        { partyName: { $regex: search, $options: 'i' } },
        { subPartyName: { $regex: search, $options: 'i' } },
        { serialNo: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const sortObj = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [stockIns, total] = await Promise.all([
      StockIn.find(query)
        .populate('createdBy', 'fullName')
        .sort(sortObj)
        .skip(skip)
        .limit(limit),
      StockIn.countDocuments(query)
    ]);

    return NextResponse.json({
      stockIns,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get stock in error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await connectToDatabase();

    const data = await request.json();

    // Generate serial number
    const count = await StockIn.countDocuments();
    const serialNo = `SI${String(count + 1).padStart(6, '0')}`;

    const stockIn = new StockIn({
      ...data,
      serialNo,
      createdBy: authUser.userId
    });

    await stockIn.save();
    await stockIn.populate('createdBy', 'fullName');

    return NextResponse.json({ stockIn }, { status: 201 });

  } catch (error) {
    console.error('Create stock in error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}