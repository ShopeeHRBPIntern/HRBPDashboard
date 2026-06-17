import { NextResponse } from "next/server";
import { getConversionCases } from "@/lib/data";

export async function GET() {
  return NextResponse.json(await getConversionCases());
}
