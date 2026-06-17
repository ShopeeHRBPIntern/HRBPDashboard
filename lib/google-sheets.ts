import { createSign } from "crypto";

const sheetsScope = "https://www.googleapis.com/auth/spreadsheets.readonly";

export async function getSheetRecords(spreadsheetId: string | undefined, range: string) {
  if (!spreadsheetId || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    return [];
  }

  const token = await getAccessToken();
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`;
  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${token}`
    },
    next: { revalidate: 60 }
  });

  if (!response.ok) {
    throw new Error(`Google Sheets read failed: ${response.status}`);
  }

  const body = (await response.json()) as { values?: string[][] };
  const [headers = [], ...rows] = body.values ?? [];
  return rows.map((row) =>
    headers.reduce<Record<string, string>>((record, header, index) => {
      record[header] = row[index] ?? "";
      return record;
    }, {})
  );
}

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  const assertion = signJwt({
    iss: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    scope: sheetsScope,
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600
  });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion
    })
  });

  if (!response.ok) {
    throw new Error(`Google token request failed: ${response.status}`);
  }

  const body = (await response.json()) as { access_token?: string };
  if (!body.access_token) {
    throw new Error("Google token response missing access_token");
  }

  return body.access_token;
}

function signJwt(payload: Record<string, unknown>) {
  const header = { alg: "RS256", typ: "JWT" };
  const encodedHeader = base64Url(JSON.stringify(header));
  const encodedPayload = base64Url(JSON.stringify(payload));
  const input = `${encodedHeader}.${encodedPayload}`;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n") ?? "";

  const signer = createSign("RSA-SHA256");
  signer.update(input);
  signer.end();

  return `${input}.${base64Url(signer.sign(privateKey))}`;
}

function base64Url(value: string | Buffer) {
  const buffer = typeof value === "string" ? Buffer.from(value) : value;
  return buffer.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
