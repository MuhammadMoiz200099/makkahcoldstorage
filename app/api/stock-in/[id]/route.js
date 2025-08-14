import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import StockIn from '@/models/StockIn';
import { getAuthUser } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await connectToDatabase();

    const stockIn = await StockIn.findById(params.id).populate('createdBy', 'fullName');
    
    if (!stockIn) {
      return NextResponse.json({ error: 'Stock in record not found' }, { status: 404 });
    }

    return NextResponse.json({ stockIn });

  } catch (error) {
    console.error('Get stock in by ID error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await connectToDatabase();

    const data = await request.json();
    
    const stockIn = await StockIn.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    ).populate('createdBy', 'fullName');

    if (!stockIn) {
      return NextResponse.json({ error: 'Stock in record not found' }, { status: 404 });
    }

    return NextResponse.json({ stockIn });

  } catch (error) {
    console.error('Update stock in error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await connectToDatabase();

    const stockIn = await StockIn.findByIdAndDelete(params.id);

    if (!stockIn) {
      return NextResponse.json({ error: 'Stock in record not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Stock in record deleted successfully' });

  } catch (error) {
    console.error('Delete stock in error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}