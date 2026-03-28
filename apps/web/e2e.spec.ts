import { test, expect } from '@playwright/test';

test('home shows title', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Mall SuperApp')).toBeVisible();
  await expect(page.getByText('推荐商品')).toBeVisible();
});
