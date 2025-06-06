import fetch from "node-fetch";

type GitHubIssue = {
  title: string;
  body: string;
  html_url: string;
  created_at: string;
  pull_request?: object;
};

export async function fetchGitHubIssues(
  owner: string,
  repo: string,
  token?: string
) {
  const url = `https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=10`;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, { headers });
  const raw = await response.json();

  if (!Array.isArray(raw)) {
    console.error("GitHub API error:", raw);
    throw new Error("GitHub API did not return an array. Check rate limits or repository name.");
  }

  const data = raw as GitHubIssue[];

  return data
    .filter(issue => !issue.pull_request)
    .map(issue => ({
      source: "github",
      title: issue.title,
      text: issue.body,
      url: issue.html_url,
      created_at: issue.created_at,
    }));
}

// ✅ Local test only when running this file directly
if (require.main === module) {
  const token = process.env.GITHUB_TOKEN!;
  fetchGitHubIssues('nanushiv', 'community-insights-demo', token)
    .then(issues => {
      console.log("📦 Developer Issues from GitHub:");
      console.log(issues);
    })
    .catch(err => {
      console.error("❌ Error fetching issues:", err);
    });
}