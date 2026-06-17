import { NextResponse } from "next/server";
import { getGoogleSheetsEnvStatus, getSheetDebugSnapshot } from "@/lib/google-sheets";

const defaultRanges = ["cases", "Internal transfer cleaned data", "Onboarding_Process"];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedRange = searchParams.get("range");
  const ranges = requestedRange ? [requestedRange] : defaultRanges;

  const checks = await Promise.all(
    ranges.map(async (range) => {
      try {
        return await getSheetDebugSnapshot(process.env.AUTOMATION_DB_SPREADSHEET_ID, range);
      } catch (error) {
        return {
          range,
          ok: false,
          error: error instanceof Error ? error.message : "Unknown Google Sheets error"
        };
      }
    })
  );

  return NextResponse.json({
    ok: checks.every((check) => check.ok),
    usingRealGoogleSheets: checks.some((check) => check.ok),
    env: getGoogleSheetsEnvStatus(),
    checkedRanges: checks,
    hint: "If env was changed while pnpm dev was running, restart the dev server."
  });
}
