#!/usr/bin/env bun
import { readFileSync } from 'fs';
import { execSync } from 'child_process';

const envFile = readFileSync('.env', 'utf-8');
const lines = envFile.split('\n');

const env = {};
for (const line of lines) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    env[key] = valueParts.join('=');
  }
}

const siteId = env.NETLIFY_SITE_ID;
if (!siteId) {
  console.error('Error: NETLIFY_SITE_ID not found in .env file');
  process.exit(1);
}

console.log(`Deploying to Netlify site: ${siteId}`);

try {
  execSync(`netlify deploy --prod --dir=public --site=${siteId}`, {
    stdio: 'inherit',
    env: { ...process.env, ...env }
  });
} catch (error) {
  process.exit(error.status || 1);
}
