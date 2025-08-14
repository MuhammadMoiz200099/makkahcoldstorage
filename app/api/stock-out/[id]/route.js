import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import StockOut from '@/models/StockOut';
import { getAuthUser } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await connectToDatabase();

    const stockOut = await StockOut.findById(params.id).populate('createdBy', 'fullName');
    
    if (!stockOut) {
      return NextResponse.json({ error: 'Stock out record not found' }, { status: 404 });
    }

    return NextResponse.json({ stockOut });

  } catch (error) {
    console.error('Get stock out by ID error:', error);
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
    
    const stockOut = await StockOut.findByIdAndUpdate(
      params.id,
      data,
      { new: true, runValidators: true }
    ).populate('createdBy', 'fullName');

    if (!stockOut) {
      return NextResponse.json({ error: 'Stock out record not found' }, { status: 404 });
    }

    return NextResponse.json({ stockOut });

  } catch (error) {
    console.error('Update stock out error:', error);
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

    const stockOut = await StockOut.findByIdAndDelete(params.id);

    if (!stockOut) {
      return NextResponse.json({ error: 'Stock out record not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Stock out record deleted successfully' });

  } catch (error) {
    console.error('Delete stock out error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}