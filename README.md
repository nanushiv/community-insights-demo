<<<<<<< HEAD
# community-insights-demo
Teams AI assignment
=======
# 🤖 Community Insights Bot

An intelligent feedback assistant that extracts pain points from community discussions (e.g., GitHub issues), analyzes them using Azure OpenAI (GPT-4o), and presents insights via an interactive Teams bot using Adaptive Cards.

-------------------------

## 🚀 Features Overview

### ✅ Step 1: Feedback Ingestion (GitHub)
- Built `github.ts` to fetch recent issues from GitHub repos.
- Extracts issue title, body, and timestamp.
- Filters for relevance using keyword heuristics.
- Fully modular with async fetching and error handling.

### ✅ Step 2: AI-Driven Feedback Extraction
- Integrated Azure OpenAI GPT-4o via Azure SDK.
- Prompts are few-shot style to extract core pain points from issues.
- Dynamic function `extractInsightsFromFeedback()` returns clean summaries.
- Azure resource name: `gpt4oInsights`.

### ✅ Step 3: Conversational Bot (Microsoft Teams)
- Built a bot using `BotFrameworkAdapter` + `Restify`.
- Server auto-starts with `ngrok` and prints public URL.
- Processes incoming messages and renders **Adaptive Cards**:
  - Collects user feedback (Great, Good, Okay, Bad).
  - Responds to submitted inputs with confirmation.
- Adaptive Card is v1.4 schema compliant.
- Logs every step (request, type, value, errors).

---------------------------------

## 🧱 Tech Stack

- **Node.js + TypeScript**
- **Bot Framework SDK v4**
- **ngrok** (for public tunneling)
- **Azure OpenAI GPT-4o**
- **Microsoft Teams Developer Tools**
- **Adaptive Cards v1.4**

-----------------------------

## 📦 Folder Structure
COMMUNITYINSIGHTSBOT/
├── bot/
│ ├── bot.ts
│ ├── index.ts
│ └── readme
├── node_modules/
├── src/
│ ├── aiProcessor.ts
│ ├── github.ts
│ └── index.ts
├── teamsAppManifest/
│ ├── color.png
│ ├── manifest.json
│ └── outline.png
├── .env
├── package-lock.json
├── package.json
├── testGithub.ts
└── tsconfig.json


----------------------------

## 🛠 Setup Instructions

1. **Clone the Repo**
   ```bash
   git clone https://github.com/your-username/CommunityInsightsBot.git
   cd CommunityInsightsBot

2. **Install Dependencies**
npm install

3. **Configure Environment**
MICROSOFT_APP_ID=your-azure-app-id
MICROSOFT_APP_PASSWORD=your-app-password
OPENAI_API_KEY=your-openai-key

4. **Start Bot Locally**
npx ts-node bot/index.ts

5. **Upload Teams Manifest**
   Zip the manifest/ folder (with manifest.json, icons).

   Go to Teams Developer Portal.

   Upload for testing (needs tenant permission or M365 dev account).

 **Testing**
  You can test via:

  Azure Bot: Test in Web Chat

  Local bot (with ngrok): visit public URL

  Microsoft Teams (via dev portal upload)
>>>>>>> c210702 (📦 Removed node_modules and updated .gitignore)
