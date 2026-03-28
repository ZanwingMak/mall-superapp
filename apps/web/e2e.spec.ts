import { test, expect } from '@playwright/test';

test('critical purchase flow works', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Mall SuperApp')).toBeVisible();
  await page.getByRole('button', { name: '加入购物车' }).first().click();

  await page.getByLabel('收货地址').selectOption({ index: 1 });
  await page.getByLabel('优惠券').selectOption({ index: 1 });
  await page.getByRole('button', { name: '提交订单' }).click();

  await expect(page.getByText('订单提交成功')).toBeVisible();
});
