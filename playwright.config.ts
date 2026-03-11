import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,   // run serially to avoid port conflicts in dev
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['list'],
  ],
  use: {
    baseURL:           process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace:             'on-first-retry',
    screenshot:        'only-on-failure',
    video:             'on-first-retry',
    actionTimeout:     15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name:  'chromium',
      use:   { ...devices['Desktop Chrome'] },
    },
    {
      name:  'firefox',
      use:   { ...devices['Desktop Firefox'] },
    },
    {
      name: 'mobile-chrome',
      use:  { ...devices['Pixel 5'] },
    },
  ],
  // Automatically start the dev server for tests
  webServer: process.env.CI ? undefined : {
    command:              'npm run dev:sandbox',
    url:                  'http://localhost:3000',
    reuseExistingServer:  !process.env.CI,
    timeout:              60_000,
    stdout:               'pipe',
    stderr:               'pipe',
  },
  expect: {
    timeout: 10_000,
  },
  outputDir: 'test-results/',
})
