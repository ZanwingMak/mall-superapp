# Mall SuperApp (v0.1.0)

多端购物商城 monorepo，目标平台：Web、Windows、macOS、iOS、Android、鸿蒙、微信小程序。

## 项目结构
- `apps/web` - Web 商城
- `apps/mobile` - Taro 多端应用
- `apps/desktop-tauri` - Tauri 桌面壳
- `packages/ui` - 共享 UI
- `packages/store` - Zustand 状态
- `packages/api-client` - API 与 Query hooks
- `packages/mock` - OpenAPI + Mock JSON + MSW
- `docs/*` - 产品、架构、接口、测试、规范、发布文档

## 快速开始
```bash
pnpm install
pnpm dev
```

## 质量保障
```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```
