import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import StockIn from '@/models/StockIn';
import StockOut from '@/models/StockOut';
import { getAuthUser } from '@/lib/auth';

export async function GET(request) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    await connectToDatabase();

    // Get distinct party names from both collections
    const [stockInParties, stockOutParties] = await Promise.all([
      StockIn.distinct("partyName"),
      StockOut.distinct("partyName")
    ]);

    // Merge + remove duplicates
    const allParties = [...new Set([...stockInParties, ...stockOutParties])];

    return NextResponse.json({ parties: allParties });
  } catch (error) {
    console.error("Get parties error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
