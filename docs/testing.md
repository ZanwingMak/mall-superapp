# 测试文档（v0.2.0）

## 测试分层
- 单元测试：Vitest（`packages/store/src/store.test.ts`）
- 组件测试：Testing Library（`apps/web/src/components/App.test.tsx`）
- E2E：Playwright（`apps/web/e2e.spec.ts` 关键购买流程）

## 关键流程（E2E）
1. 打开首页
2. 加入购物车
3. 选择地址与优惠券
4. 提交订单并看到成功提示

## 执行命令
```bash
pnpm --filter @mall/store test
pnpm --filter @mall/web test
pnpm --filter @mall/web e2e
```

## CI
- `CI / web-and-tests`：web build + unit/component + e2e
- `CI / mobile-build-node20`：Node20 下构建 mobile
