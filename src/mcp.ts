import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";
import * as z from "zod/v4";
import { createCheckIn, getCheckIn, getPlan, makePlan } from "./care.js";
import { makeFamilyBrief } from "./bedrock.js";

const server = new McpServer({ name: "CareRelay", version: "1.0.0" });
server.registerTool("create_checkin", {
  title: "Create consent-aware check-in",
  description: "Save a family check-in and return its consent state and safety notice.",
  inputSchema: z.object({ person: z.string(), relation: z.string(), update: z.string(), consent: z.enum(["share", "private"]) })
}, async (input) => ({ content: [{ type: "text", text: JSON.stringify(createCheckIn(input), null, 2) }] }));
server.registerTool("create_followup_plan", {
  title: "Create follow-up plan", description: "Create assigned follow-up tasks for a check-in.", inputSchema: z.object({ checkinId: z.string() })
}, async ({ checkinId }) => {
  const checkIn = getCheckIn(checkinId); if (!checkIn) return { content: [{ type: "text", text: "Check-in not found." }], isError: true };
  return { content: [{ type: "text", text: JSON.stringify(makePlan(checkIn), null, 2) }] };
});
server.registerTool("get_daily_brief", {
  title: "Get family brief", description: "Return a consent-aware family brief.", inputSchema: z.object({ checkinId: z.string() })
}, async ({ checkinId }) => {
  const checkIn = getCheckIn(checkinId); if (!checkIn) return { content: [{ type: "text", text: "Check-in not found." }], isError: true };
  return { content: [{ type: "text", text: await makeFamilyBrief(checkIn, getPlan(checkinId)) }] };
});
server.registerTool("get_consent_status", {
  title: "Get consent status", description: "Return whether a check-in may be shared.", inputSchema: z.object({ checkinId: z.string() })
}, async ({ checkinId }) => {
  const checkIn = getCheckIn(checkinId); if (!checkIn) return { content: [{ type: "text", text: "Check-in not found." }], isError: true };
  return { content: [{ type: "text", text: JSON.stringify({ consent: checkIn.consent, explanation: checkIn.consent === "share" ? "Sharing allowed." : "Private: family brief blocked." }) }] };
});
console.error("CareRelay MCP server running on stdio");
void serveStdio(() => server);
