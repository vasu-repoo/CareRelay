# CareRelay 💙

### Consent-first family coordination

CareRelay turns family check-ins into clear, actionable coordination plans while respecting each person's choice about what information can be shared.

**Live Demo:** https://carerelay-7wal.onrender.com
**GitHub Repository:** https://github.com/vasu-repoo/CareRelay

---

## 💡 The Problem

Family members often coordinate care through scattered messages, calls, and reminders. Important updates can get lost, responsibilities may be unclear, and private information can be shared without sufficient care.

## ✨ Our Solution

CareRelay provides a simple workflow for recording a check-in, choosing whether it can be shared, generating a family coordination brief, and organizing follow-up tasks.

### Key Features

* **Consent-first sharing:** A private check-in does not generate a shareable family brief.
* **Family coordination briefs:** Summarize shared updates into a clear, readable message.
* **Actionable tasks:** Organize follow-ups by task owner and due date.
* **Simple dashboard:** Keep check-ins, family briefs, and tasks in one interface.
* **Privacy-conscious design:** Keep private information out of shareable briefs when sharing has not been permitted.
* **AI integration:** The application is configured to use Amazon Bedrock with Amazon Nova 2 Lite. Successful invocation in the deployed environment must be verified separately from local fallback behavior.

## 🛠️ Technology Stack

* TypeScript
* Node.js
* HTML and CSS
* Amazon Bedrock — Amazon Nova 2 Lite
* Render — web application hosting
* Git and GitHub

## 🔄 How It Works

1. Record a family member's check-in.
2. Select the appropriate consent option.
3. If sharing is permitted, generate a family brief.
4. Review the follow-up plan and task owners.
5. Use the plan to coordinate the next steps.

Private check-ins should remain private and must not generate a shareable family brief.

## 🚀 Run Locally

### Prerequisites

* Node.js and npm
* Git

### 1. Clone the repository

```bash
git clone https://github.com/vasu-repoo/CareRelay.git
cd CareRelay
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root and configure the values required by your application.

```env
USE_BEDROCK=false
AWS_REGION=ap-southeast-2
BEDROCK_MODEL_ID=global.amazon.nova-2-lite-v1:0
```

The example disables Bedrock so you can test the local fallback first.

To enable Bedrock, set `USE_BEDROCK=true` and configure AWS credentials securely in your local environment. Never commit `.env` files, access keys, or secret keys to GitHub.

### 4. Start the application

```bash
npm start
```

Use the local address printed by the application, if applicable.

## ☁️ Deployment

CareRelay is deployed on Render and connected to its GitHub repository.

For a deployed Bedrock integration, configure the required environment variables in Render's service settings. Verify AWS credentials, region, model access, and successful model invocation in the service logs.

Do not expose AWS credentials in source code, screenshots, public logs, or repository files.

## 🔐 Privacy and Safety

* Respect the user's sharing choice.
* Do not create a shareable family brief for a private check-in.
* Share only information needed for coordination.
* Treat generated content as a coordination aid, not medical advice.
* Use fictional data in public demonstrations and screenshots.

**Important:** A consent gate in the application is not a substitute for secure storage, access controls, and appropriate handling of sensitive information.

## 🗺️ Roadmap

* [ ] Verify successful Amazon Bedrock invocation in the deployed environment.
* [ ] Improve error handling and integration diagnostics.
* [ ] Expand automated tests for consent and task workflows.
* [ ] Improve accessibility and responsive behavior.
* [ ] Prepare a concise end-to-end project demonstration.

## 🎯 Project Goal

CareRelay aims to make family coordination clearer, more actionable, and more respectful of consent.

Built for a developer hackathon project.
