# Changelog

## v0.4.0 - 2026-03-29

### Added
- 新增 **智能排序**：支持智能推荐、销量优先、评分优先、价格升/降序。
- 新增 **商品对比**：首页+详情可加入对比，最多 3 件并支持维度表格查看。
- 新增 **活动详情展开**：活动卡片可查看规则、时间与亮点信息（`/api/campaigns/{id}`）。
- 新增 **消息通知中心**（`/notifications`）：未读筛选 + 类型化消息展示。
- 新增 **浏览足迹**（`/footprints`）：按来源展示最近浏览并支持一键回看。
- 新增 **发票信息**：结算页支持个人/企业抬头与税号填写。
- 新增 **售后申请入口**：订单页可发起售后申请（mock 表单）。
- Mock/API 扩展：`/api/notifications`、`/api/footprints`、`/api/campaigns/{id}`。

### Changed
- 视觉细节优化：卡片层次、hover/active 微交互、筛选/排序控件可读性提升。
- 版本升级到 `0.4.0`。
- CI 工作流强化：Tauri 构建增加 ubuntu 平台并对失败场景提供 fallback note artifact，避免阻断主流程。

### Known limitations
- 售后、发票、通知已为前台 mock 能力，尚未接入真实后端状态写回。
- Tauri 在部分 runner 仍可能受系统依赖与签名条件影响，当前已降级为 best-effort + fallback 记录。

## v0.3.0 - 2026-03-29

### Added
- 首页重构：顶部导航、搜索、轮播 Banner、活动区、分类宫格、热门榜单、新人专区。
- 商品详情页：图文详情、规格选择、库存展示、评价预览。
- 购物车与结算链路升级：全选、删除、数量增减、失效状态、优惠券、运费、订单备注、下单成功页。
- 个人中心与关联页面：个人主页、订单状态筛选、收藏页、地址管理页。
- 视觉系统基础组件：Button/Card/Tag/Empty/Skeleton + toast 反馈。
- Mock / OpenAPI 扩展：`/api/home`、`/api/products/{id}`、`/api/reviews`、订单状态过滤。
- 新增测试覆盖（组件流程 + store 逻辑），累计新增 5+ 用例。

### Changed
- 版本升级到 `0.3.0`。
- Web 信息架构升级为多页面路径（首页/详情/购物车/结算/成功/个人中心/订单/收藏/地址）。

### Notes
- 本轮按需求忽略打包问题，聚焦前台体验与功能深度。
- Release 链接需 push tag 后由仓库发布页生成。

## v0.2.0 - 2026-03-29

### Added
- Web 高价值能力：商品搜索+分类筛选、收藏、优惠券、支付方式切换、地址选择、订单列表。
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
