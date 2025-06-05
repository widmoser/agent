import { getInput } from '@actions/core';
import { getOctokit } from '@actions/github';

const repository = getInput('repository');
const branch = getInput('branch');

const apiKey = getInput('openrouter_api_key');
const model = getInput('model');
const githubToken = getInput('github_token');
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