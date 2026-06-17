import { NextResponse } from "next/server";
import { getDashboardSummary } from "@/lib/data";

export async function GET() {
  return NextResponse.json(await getDashboardSummary());
}
