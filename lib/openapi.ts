export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Smart HR Ops Dashboard API",
    version: "1.1.0",
    description: "API contract for the HRBP-only Smart HR Ops Dashboard."
  },
  servers: [{ url: "/api" }],
  paths: {
    "/dashboard/summary": {
      get: {
        tags: ["Dashboard"],
        summary: "Get cross-process HRBP dashboard summary",
        responses: {
          "200": { description: "Dashboard summary" },
          "500": { description: "Server error" }
        }
      }
    },
    "/internal-transfer/cases": {
      get: {
        tags: ["InternalTransfer"],
        summary: "List Internal Transfer cases",
        parameters: [
          query("status"),
          query("pendingActor"),
          query("department"),
          query("entity"),
          query("q"),
          query("sort"),
          query("page", "integer"),
          query("pageSize", "integer")
        ],
        responses: {
          "200": { description: "Paginated Internal Transfer case list" },
          "500": { description: "Server error" }
        }
      }
    },
    "/internal-transfer/cases/{caseId}": {
      get: {
        tags: ["InternalTransfer"],
        summary: "Get Internal Transfer case detail",
        parameters: [
          {
            name: "caseId",
            in: "path",
            required: true,
            schema: { type: "string" }
          }
        ],
        responses: {
          "200": { description: "Internal Transfer case detail" },
          "404": { description: "Resource not found" },
          "500": { description: "Server error" }
        }
      }
    },
    "/conversion/cases": {
      get: {
        tags: ["Conversion"],
        summary: "List Conversion cases",
        responses: {
          "200": { description: "Conversion case list" },
          "500": { description: "Server error" }
        }
      }
    },
    "/onboarding/joiners": {
      get: {
        tags: ["Onboarding"],
        summary: "List onboarding joiners",
        parameters: [query("stepTracker"), query("department"), query("q"), query("page", "integer"), query("pageSize", "integer")],
        responses: {
          "200": { description: "Onboarding joiner list" },
          "500": { description: "Server error" }
        }
      }
    },
    "/actions/{actionName}": {
      post: {
        tags: ["Actions"],
        summary: "Trigger a safe dashboard action",
        parameters: [
          {
            name: "actionName",
            in: "path",
            required: true,
            schema: {
              type: "string",
              enum: ["refresh_case", "sync_sheet", "request_salary_check", "open_source_sheet"]
            }
          }
        ],
        responses: {
          "200": { description: "Action result" },
          "400": { description: "Invalid request" },
          "500": { description: "Server error" }
        }
      }
    }
  }
};

function query(name: string, type = "string") {
  return {
    name,
    in: "query",
    required: false,
    schema: { type }
  };
}
