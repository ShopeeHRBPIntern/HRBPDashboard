import { NextResponse } from "next/server";
import { getInternalTransferDetail } from "@/lib/data";

export async function GET(_: Request, { params }: { params: { caseId: string } }) {
  const detail = await getInternalTransferDetail(params.caseId);
  if (!detail) {
    return NextResponse.json({ ok: false, error: "not_found", message: "Case not found" }, { status: 404 });
  }

  return NextResponse.json(detail);
}
