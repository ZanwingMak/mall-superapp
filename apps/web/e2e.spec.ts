import { test, expect } from '@playwright/test';

test('critical purchase flow works', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Mall SuperApp')).toBeVisible();
  await page.getByRole('button', { name: '加入购物车' }).first().click();
  await page.getByRole('button', { name: '购物车' }).click();
  await page.getByRole('button', { name: '去结算' }).click();

  await page.getByLabel('收货地址').selectOption({ index: 1 });
  await page.getByRole('button', { name: '提交订单' }).click();

  await expect(page.getByText('下单成功')).toBeVisible();
});
