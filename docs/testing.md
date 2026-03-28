# 测试文档

## 测试分层
- 单元测试：Vitest（store/api 逻辑）
- 组件测试：Testing Library（Web 页面）
- E2E：Playwright（Web 关键路径）

## 关键流程
1. 打开首页
2. 加载商品列表
3. 展示购物车模块

## 执行命令
```bash
pnpm test
pnpm --filter @mall/web e2e
```
