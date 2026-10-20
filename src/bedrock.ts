import "dotenv/config";
import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import type { CheckIn, Task } from "./care.js";

const fallback = (checkIn: CheckIn, tasks: Task[]) =>
  `${checkIn.person}'s update was recorded with ${checkIn.consent} consent. The family plan includes ${tasks.map(t => `${t.owner}: ${t.title.toLowerCase()}`).join("; ")}. This is a coordination note, not medical advice.`;

export async function makeFamilyBrief(checkIn: CheckIn, tasks: Task[]) {
  if (checkIn.consent !== "share") return "This check-in is private. No family brief was created.";
  if (process.env.USE_BEDROCK !== "true") {
  return fallback(checkIn, tasks) + "\n\nDemo mode: using a local-generated brief; Amazon Bedrock is not active.";
}
  const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION || "ap-southeast-2" });
  const command = new ConverseCommand({
    modelId: process.env.BEDROCK_MODEL_ID || "global.amazon.nova-2-lite-v1:0",
    system: [{ text: "Write a factual, calm family update in under 70 words. Do not diagnose, prescribe, speculate, or give emergency advice. Mention consent. Return plain text only." }],
    messages: [{ role: "user", content: [{ text: JSON.stringify({ checkIn, tasks }) }] }],
    inferenceConfig: { maxTokens: 140, temperature: 0.2 }
  });
  const result = await client.send(command);
  return result.output?.message?.content?.[0]?.text || fallback(checkIn, tasks);
}
