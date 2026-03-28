import { defineConfig } from '@playwright/test';

export default defineConfig({
  testMatch: /e2e\.spec\.ts$/,
  use: { baseURL: 'http://127.0.0.1:5193' }
});
