# CareRelay

> **Consent-first family handoffs, powered by a self-hosted Alexa+ MCP server.**

CareRelay turns one sensitive family update into a clear, respectful follow-up plan. It records a consent-aware check-in, applies a deterministic safety gate, assigns small actions to the right people, and produces a factual family brief only when sharing is permitted.

Built for the **Alexa+ Track** of the Build, Ship, Shape: Amazon Developer Hackathon.

## The problem

Care coordination often happens in scattered chats: someone says “Dad missed his reminder and feels tired,” but nobody knows who will follow up, whether the update may be shared, or what should happen next. Existing chat experiences can make sensitive conversations feel casual and ambiguous.

CareRelay makes the handoff explicit: **update → consent + safety gate → owned tasks → family brief**.

## What it does

1. Creates a structured family check-in with a clear sharing choice.
2. Uses a deterministic phrase-based safety gate for urgent language. It never diagnoses, prescribes, or decides whether an emergency exists; it directs users to local emergency services or qualified professionals when appropriate.
3. Generates three concrete, owner-based follow-up tasks.
4. Blocks family briefs when the update is private.
5. Exposes the same workflow through four MCP tools, so an Alexa+ agent or any compatible MCP host can orchestrate it.

## Why MCP

The browser dashboard is a simulator. The product’s core capability is its self-hosted **Model Context Protocol** server:

| MCP tool | Purpose |
| --- | --- |
| `create_checkin` | Save a check-in and return its consent state and safety notice. |
| `create_followup_plan` | Create assigned, time-bound follow-up tasks. |
| `get_daily_brief` | Return a shareable family brief only when consent permits. |
| `get_consent_status` | Make the sharing decision visible to the agent. |

This makes the workflow inspectable and reusable—not a hidden prompt behind a chat box.

## Architecture

```text
Browser dashboard
       │ HTTP JSON
Express API ───────────────► Amazon Bedrock Converse API (optional)
       │
       ├── deterministic consent + safety rules
       ├── in-memory demo store
       └── self-hosted MCP stdio server
             ├── create_checkin
             ├── create_followup_plan
             ├── get_daily_brief
             └── get_consent_status
```

## Run locally

### Prerequisites

- Node.js 20 or newer
- npm

### Start the dashboard

```powershell
git clone https://github.com/vasu-repoo/carecircle-mcp.git
cd carecircle-mcp
Copy-Item .env.example .env
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The application starts in a complete **local demo mode**. This keeps the primary Alexa+ MCP workflow testable even when AWS credentials are unavailable.

### Prove the MCP workflow

```powershell
npm run mcp:demo
```

The demo client launches the server, lists all four tools, and calls them in the same sequence shown in the dashboard.

## Amazon Bedrock integration

CareRelay includes an optional Amazon Bedrock Converse API integration for the family brief, configured for **Amazon Nova 2 Lite**:

```env
AWS_REGION=ap-southeast-2
BEDROCK_MODEL_ID=global.amazon.nova-2-lite-v1:0
USE_BEDROCK=true
```

The integration sends only the structured fictional demo check-in and its tasks. Its system prompt constrains the output to a calm, factual message under 70 words and explicitly forbids diagnosis, prescriptions, and speculation.

Keep `USE_BEDROCK=false` unless your AWS account can successfully invoke Bedrock. Do not commit `.env` or credentials.

## Safety and privacy by design

- The demo uses fictional data only.
- A private check-in never produces a shareable brief.
- Urgent-phrase matching is transparent and deterministic, not an opaque clinical model.
- CareRelay does not provide medical advice, medication changes, diagnosis, or emergency dispatch.
- A production implementation would add encryption, granular roles, auditable consent, and clinician-reviewed escalation policies.

## Demo scenario

Use this fictional scenario in the dashboard and MCP client:

> Daniel Shah missed his evening medication reminder and said he felt unusually tired. He is resting and asked Maya to check in later.

The demo shows a consent-aware check-in, an action plan owned by Maya and Arjun, the consent status, and a factual family brief.

## Project structure

```text
public/index.html       # Dashboard simulator
src/care.ts             # Consent, check-in, safety, and task logic
src/server.ts           # Express API and static dashboard host
src/mcp.ts              # Self-hosted MCP server
src/mcp-demo.ts         # Repeatable MCP proof client
src/bedrock.ts          # Optional Bedrock Converse API family brief
```

## Built with

TypeScript · Node.js · Express · Model Context Protocol · Zod · Amazon Bedrock Converse API · Amazon Nova 2 Lite

## License

[MIT](LICENSE)
