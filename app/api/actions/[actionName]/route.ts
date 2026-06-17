import { NextResponse } from "next/server";

const allowedActions = new Set(["refresh_case", "sync_sheet", "request_salary_check", "open_source_sheet"]);

export async function POST(request: Request, { params }: { params: { actionName: string } }) {
  if (!allowedActions.has(params.actionName)) {
    return NextResponse.json({ ok: false, error: "bad_request", message: "Unknown action" }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.caseId || !body?.process) {
    return NextResponse.json({ ok: false, error: "bad_request", message: "caseId and process are required" }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    actionName: params.actionName,
    caseId: body.caseId,
    message: "Action accepted by dashboard mock adapter. Wire this route to n8n when webhooks are ready.",
    data: {
      process: body.process,
      payload: body.payload ?? {}
    }
  });
}
