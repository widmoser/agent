import { getOctokit } from '@actions/github';

export async function createPullRequestForIssue(
  repository: string, 
  branch: string, 
  apiKey: string, 
  model: string, 
  githubToken: string
): Promise<void> {
  const octokit = getOctokit(githubToken)
  await octokit.request(`POST /repos/${repository}/pulls`, {
    owner: 'OWNER',
    repo: 'REPO',
    title: 'Amazing new feature',
    body: 'Please pull these awesome changes in!',
    head: branch,
    base: 'master',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })
}

