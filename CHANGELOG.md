# Changelog

## v0.2.0 - 2026-03-29

### Added
- Web 高价值能力：商品搜索+分类筛选、收藏、优惠券、地址管理入口、支付方式切换、订单列表。
- API 契约扩展：`/api/coupons`、`/api/addresses`、`/api/orders`、`/api/checkout`。
- Mock 数据完善：商品扩展字段（分类/标签/库存）+ 订单/地址/优惠券数据。
- 测试增强：
  - 组件测试覆盖新页面模块
  - Store 单元测试
  - Playwright 关键下单路径 E2E
- 工程化：
  - CI（web build/test/e2e + mobile Node20 build）
  - Tauri 跨平台（macOS/Windows）打包 workflow
  - Release workflow 自动上传 web/mobile 产物
- Tauri Rust 环境检查脚本：`apps/desktop-tauri/scripts/check-rust.sh`

### Changed
- 版本升级到 `0.2.0`
- Playwright webServer 改为 `--strictPort`，修复端口漂移导致的超时阻塞。
- Web 支持 `VITE_ENABLE_MSW=true` 场景，以支撑 preview/e2e 下 mock API。

### Known limitations
- 本机 Node 25 环境下 Taro 构建仍不兼容（已提供 Node20 CI/本地规避方案）。
- 本机缺 Rust，Tauri 本地未实际打包（CI 可复现）。
