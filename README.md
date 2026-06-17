# HRBP Dashboard

Next.js dashboard for HRBP operations across Internal Transfer, Conversion, and Onboarding.

## Run Locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## API Docs

- OpenAPI JSON: `http://localhost:3000/api/openapi.json`
- Swagger UI: `http://localhost:3000/api/docs`

## Data Source

The app reads Google Sheets on the server when these env vars are configured:

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
AUTOMATION_DB_SPREADSHEET_ID=
```

Expected automation DB tabs:

- `cases`
- `Internal transfer cleaned data`
- `Onboarding_Process`

When env vars are missing or Sheets cannot be reached, the app uses local mock rows shaped like the current CSV schemas.
