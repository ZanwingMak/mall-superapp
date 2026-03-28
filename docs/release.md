# 发布说明（v0.1.0）

## 版本
- 初始语义化版本：`v0.1.0`

## 产物
- Web 构建产物：`apps/web/dist`
- 桌面端：Tauri 工程可打包（当前环境缺 Rust 工具链，需安装后执行）
- 小程序：Taro 构建产物（`apps/mobile/dist`）

## 发布流程
1. `pnpm build && pnpm test`
2. `git tag v0.1.0`
3. `gh release create v0.1.0 ... --notes-file docs/release.md`
