import { defineConfig, devices } from '@playwright/test';

// Override when 4321 is held by another process: SMOKE_PORT=4325 npm run smoke:work -- <slug>
const port = Number(process.env.SMOKE_PORT ?? 4321);

export default defineConfig({
  testDir: './tests',
  outputDir: 'test-results',
  // One retry on CI absorbs rare long-suite flakes (a full works sweep boots
  // 69 pages in one run); local runs stay strict.
  retries: process.env.CI ? 1 : 0,
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    trace: 'on-first-retry',
  },
  webServer: {
    command: `npm run dev -- --host 127.0.0.1 --port ${port}`,
    url: `http://127.0.0.1:${port}`,
    reuseExistingServer: true,
    timeout: 60_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],
});
