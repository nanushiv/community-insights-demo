// testGithub.ts
import * as dotenv from 'dotenv';
dotenv.config();

import { fetchGitHubIssues } from './src/github';
import { extractPainPoints } from './src/aiProcessor';

const token = process.env.GITHUB_TOKEN!;
const owner = 'nanushiv';
const repo = 'community-insights-demo';

async function main() {
  const issues = await fetchGitHubIssues(owner, repo, token);
  console.log("📦 Developer Issues from GitHub:");
  console.log(issues);

  // Prepare feedback format for AI
  const feedback = issues.map(issue => ({
    title: issue.title,
    text: issue.text
  }));

  // Call GPT-4o to extract pain points
  const insights = await extractPainPoints(feedback);

  console.log("\n📌 Extracted Pain Points:");
  insights.forEach((point, i) => console.log(`${i + 1}. ${point}`));
}

main();
