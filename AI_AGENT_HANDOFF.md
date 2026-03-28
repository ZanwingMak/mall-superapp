# AI Agent Handoff

## 本轮完成
- 修复并规避 mobile Node25 问题：锁定 Node20 兼容路径（Volta/Docker/CI）。
- 修复 Playwright 阻塞：改 strictPort + preview 场景启用 MSW。
- 补齐 Tauri 交付链路：Rust 环境检查脚本 + macOS/Windows CI 打包。
- 新增高价值功能：搜索筛选、收藏、优惠券、支付方式、地址选择、订单列表。
- 扩展 API 契约与 mock 数据，增加单测/组件测/E2E。

## 待确认/阻塞
- 当前机器缺 Rust，无法本地执行 Tauri build。
- Node 25 下 Taro 依然不稳定，需严格使用 Node 20。
- GitHub Release 链接需在主仓库 push tag 后生成。

## 下一步建议
1. 合并到 main 后触发 CI，确认 mobile + e2e + tauri 全绿。
2. 创建 GitHub Release（v0.2.0）并检查 assets 完整性。
3. 继续扩展真实后端接入（鉴权、下单、订单详情）。
