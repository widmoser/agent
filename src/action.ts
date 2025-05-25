import { core } from '@actions/core';
import { github } from '@actions/github';

const repository = core.getInput('repository');
const branch = core.getInput('branch');

const apiKey = core.getInput('openrouter_api_key');
const model = core.getInput('model');
const githubToken = core.getInput('github_token');
const octokit = github.getOctokit(githubToken)

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