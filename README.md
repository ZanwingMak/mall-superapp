# Mall SuperApp (v0.2.0)

多端购物商城 monorepo，目标平台：Web、Windows、macOS、iOS、Android、鸿蒙、微信小程序。

## 项目结构
- `apps/web` - Web 商城（搜索筛选、收藏、优惠券、地址、支付方式、订单列表）
- `apps/mobile` - Taro 多端应用（Node 20 兼容构建）
- `apps/desktop-tauri` - Tauri 桌面壳（含 Rust 环境检查脚本）
- `packages/ui` - 共享 UI
- `packages/store` - Zustand 状态
- `packages/api-client` - API 与 Query hooks
- `packages/mock` - OpenAPI + Mock JSON + MSW
- `.github/workflows/*` - CI / Tauri 打包 / Release 产物上传

## 快速开始
```bash
pnpm install
pnpm dev
```

## 构建与测试
```bash
pnpm --filter @mall/web build
pnpm --filter @mall/mobile build
pnpm --filter @mall/web test
pnpm --filter @mall/store test
pnpm --filter @mall/web e2e
```

## Node 兼容说明（Taro）
Taro 4.x 在 Node 25 下会触发依赖解析异常，建议使用 Node 20：
- 本地：`nvm use 20` 或 `volta install node@20`
- Docker：`pnpm build:mobile:node20:docker`
- CI：见 `.github/workflows/ci.yml` 的 `mobile-build-node20`

## 桌面端（Tauri）
```bash
pnpm --filter @mall/desktop-tauri doctor
pnpm --filter @mall/desktop-tauri build
```
如本机无 Rust，可直接通过 `.github/workflows/tauri.yml` 在 macOS / Windows 出包。
