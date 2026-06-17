import { NextResponse } from "next/server";
import { getOnboardingJoiners } from "@/lib/data";

export async function GET() {
  return NextResponse.json(await getOnboardingJoiners());
}
