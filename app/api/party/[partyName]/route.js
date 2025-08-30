import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import StockIn from "@/models/StockIn";
import StockOut from "@/models/StockOut";
import { getAuthUser } from "@/lib/auth";

export async function GET(request, { params }) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await connectToDatabase();

    const { partyName } = params;

    // Case-insensitive match
    const stockIn = await StockIn.find({ partyName: { $regex: `^${partyName}$`, $options: "i" } })
      .sort({ createdAt: -1 })
      .lean();

    const stockOut = await StockOut.find({ partyName: { $regex: `^${partyName}$`, $options: "i" } })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      partyName,
      stockIn,
      stockOut,
    });
  } catch (error) {
    console.error("Get records by partyName error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
