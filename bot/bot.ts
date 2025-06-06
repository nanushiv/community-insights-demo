// //bot/bot.ts
import { TurnContext, CloudAdapter, ConfigurationServiceClientCredentialFactory, ConfigurationBotFrameworkAuthentication, MemoryStorage } from 'botbuilder';
import {
  Application,
  DefaultConversationState,
  DefaultUserState,
  DefaultTempState,
  TurnState
} from '@microsoft/teams-ai';
import { AdaptiveCards } from '@microsoft/adaptivecards-tools';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

import { fetchGitHubIssues } from '../src/github';
import { extractPainPoints } from '../src/aiProcessor';

// ✅ Setup credentials and adapter
const credentialsFactory = new ConfigurationServiceClientCredentialFactory({
  MicrosoftAppId: process.env.MicrosoftAppId || '',
  MicrosoftAppPassword: process.env.MicrosoftAppPassword || '',
  MicrosoftAppType: 'MultiTenant'
});
const auth = new ConfigurationBotFrameworkAuthentication(undefined, credentialsFactory);
const cloudAdapter = new CloudAdapter(auth);

// ✅ Required type override
const adapter = cloudAdapter as any;

const storage = new MemoryStorage();

// ✅ Define bot state shape
type ApplicationTurnState = TurnState<
  DefaultConversationState,
  DefaultUserState,
  DefaultTempState
>;

// ✅ Initialize bot app (🔥 no conversationState needed)
const app = new Application<ApplicationTurnState>({
  adapter,
  storage
});

// ✅ Bot message handler
app.message(".*", async (context: TurnContext, state) => {
  const userMessage = context.activity.text.trim().toLowerCase();

  if (userMessage.includes("pain") || userMessage.includes("issues")) {
    const issues = await fetchGitHubIssues('nanushiv', 'community-insights-demo', process.env.GITHUB_TOKEN);
    const feedback = issues.map(issue => ({ title: issue.title, text: issue.text }));
    const painPoints = await extractPainPoints(feedback);

    const card = AdaptiveCards.declare(path.join(__dirname, './cards/painPointsCard.json'));
    const cardJson = card.render({ issues: painPoints });

    await context.sendActivity({
      attachments: [{
        contentType: "application/vnd.microsoft.card.adaptive",
        content: cardJson
      }]
    });
  } else {
    await context.sendActivity(`Hi! Type "show pain points" to analyze recent developer feedback.`);
  }
});

export default app;
