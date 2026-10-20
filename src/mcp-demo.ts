import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";

const client = new Client({ name: "CareRelay-demo-client", version: "1.0.0" });
await client.connect(new StdioClientTransport({ command: "npx", args: ["tsx", "src/mcp.ts"] }));
console.log("TOOLS:", (await client.listTools()).tools.map(tool => tool.name).join(", "));
const created = await client.callTool({ name: "create_checkin", arguments: {
  person: "Daniel Shah", relation: "father", consent: "share",
  update: "Dad missed his evening medication reminder and said he felt unusually tired. He is resting and asked Maya to check in later."
} });
const text = created.content.find(block => block.type === "text")?.text ?? "{}";
console.log("CREATE CHECK-IN:\n", text);
const id = JSON.parse(text).checkIn.id;
console.log("PLAN:\n", (await client.callTool({ name: "create_followup_plan", arguments: { checkinId: id } })).content);
console.log("CONSENT:\n", (await client.callTool({ name: "get_consent_status", arguments: { checkinId: id } })).content);
console.log("BRIEF:\n", (await client.callTool({ name: "get_daily_brief", arguments: { checkinId: id } })).content);
await client.close();
