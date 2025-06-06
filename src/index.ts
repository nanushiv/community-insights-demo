// // src/index.ts
// import * as dotenv from 'dotenv';
// dotenv.config();
// import { fetchGitHubIssues } from './github';
// import { extractPainPoints } from './aiProcessor';

// //const token = 'ghp_xxxxx'; // move to env if needed
// const token = process.env.GITHUB_TOKEN!;

// async function main() {
//   const issues = await fetchGitHubIssues('nanushiv', 'community-insights-demo', token);
//     const feedback = issues.map(issue => ({
//     title: issue.title,
//     text: issue.text // ✅ use 'text' not 'body'
//   }));


//   const insights = await extractPainPoints(feedback);
//   console.log("📌 Extracted Pain Points:");
//   insights.forEach((point, i) => console.log(`${i + 1}. ${point}`));
// }

// main();


// index.ts
import * as dotenv from 'dotenv';
dotenv.config();

import { fetchGitHubIssues } from './github';
import { extractPainPoints } from './aiProcessor';

const token = process.env.GITHUB_TOKEN!;
const owner = 'nanushiv';
const repo = 'community-insights-demo';

async function main() {
  // Step 1: Fetch GitHub issues
  const issues = await fetchGitHubIssues(owner, repo, token);
  console.log("📦 Developer Issues from GitHub:");
  console.log(issues);

  if (issues.length === 0) {
    console.warn("⚠️ No issues to process.");
    return;
  }

  // Step 2: Send feedback to GPT-4o model for pain point extraction
  const feedback = issues.map(issue => ({
    title: issue.title,
    text: issue.text
  }));

  try {
    const insights = await extractPainPoints(feedback);

    console.log("\n📌 Extracted Pain Points:");
    insights.forEach((point, index) => {
      console.log(`${index + 1}. ${point}`);
    });
  } catch (error) {
    console.error("❌ Failed to extract pain points:", error);
  }
}

main();
