import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import StockOut from '@/models/StockOut';
import { getAuthUser } from '@/lib/auth';

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
        { driverName: { $regex: search, $options: 'i' } },
        { serialNo: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const sortObj = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [stockOuts, total] = await Promise.all([
      StockOut.find(query)
        .populate('createdBy', 'fullName')
        .sort(sortObj)
        .skip(skip)
        .limit(limit),
      StockOut.countDocuments(query)
    ]);

    return NextResponse.json({
      stockOuts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get stock out error:', error);
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
    const count = await StockOut.countDocuments();
    const serialNo = `SO${String(count + 1).padStart(6, '0')}`;

    const stockOut = new StockOut({
      ...data,
      serialNo,
      createdBy: authUser.userId
    });

    await stockOut.save();
    await stockOut.populate('createdBy', 'fullName');

    return NextResponse.json({ stockOut }, { status: 201 });

  } catch (error) {
    console.error('Create stock out error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}