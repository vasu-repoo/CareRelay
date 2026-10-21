
import "dotenv/config";
import {
  BedrockRuntimeClient,
  ConverseCommand,
} from "@aws-sdk/client-bedrock-runtime";

import type { CheckIn, Task } from "./care.js";

const fallback = (checkIn: CheckIn, tasks: Task[]): string => {
  const familyPlan =
    tasks.length > 0
      ? tasks
          .map((task) => `${task.owner}: ${task.title.toLowerCase()}`)
          .join("; ")
      : "No tasks have been added yet.";

  return (
    `${checkIn.person}'s update was recorded with ${checkIn.consent} consent. ` +
    `The family plan includes: ${familyPlan}. ` +
    "This is a coordination note, not medical advice."
  );
};

export async function makeFamilyBrief(
  checkIn: CheckIn,
  tasks: Task[],
): Promise<string> {
  // Never generate a shareable brief for a private check-in.
  if (checkIn.consent !== "share") {
    return "This check-in is private. No family brief was created.";
  }

  // Use the local fallback when Bedrock is disabled.
  if (process.env.USE_BEDROCK !== "true") {
    return (
      fallback(checkIn, tasks) +
      "\n\nDemo mode: using a locally generated brief; Amazon Bedrock is not active."
    );
  }

  const client = new BedrockRuntimeClient({
    region: process.env.AWS_REGION || "ap-southeast-2",
  });

  try {
    const command = new ConverseCommand({
      modelId:
        process.env.BEDROCK_MODEL_ID ||
        "global.amazon.nova-2-lite-v1:0",

      system: [
        {
          text:
            "Write a factual, calm family coordination update in under 70 words. " +
            "Mention that the check-in was shared with consent. " +
            "Summarize only the provided information and tasks. " +
            "Do not diagnose, prescribe, speculate, or give emergency advice. " +
            "If there are no tasks, explicitly say that no tasks have been added. " +
            "Return plain text only.",
        },
      ],

      messages: [
        {
          role: "user",
          content: [
            {
              text: JSON.stringify({ checkIn, tasks }),
            },
          ],
        },
      ],

      inferenceConfig: {
        maxTokens: 140,
        temperature: 0.2,
      },
    });

    const result = await client.send(command);
    console.log("✅ Amazon Bedrock request succeeded");

    const brief = result.output?.message?.content
      ?.find((item) => "text" in item)
      ?.text;

    return brief?.trim() || fallback(checkIn, tasks);
  } catch (error) {
    console.error("Amazon Bedrock request failed:", error);

    return (
      fallback(checkIn, tasks) +
      "\n\nDemo mode: Amazon Bedrock was unavailable, so a local-generated brief was used."
    );
  }
}