# 技术架构设计（v0.1.0）

## 1. 技术栈
- 前端：Taro + React + TypeScript + TailwindCSS
- 状态：Zustand
- 请求与缓存：TanStack Query
- 桌面壳：Tauri（Windows/macOS）
- Mock：MSW + mock JSON + OpenAPI
- 测试：Vitest + Testing Library + Playwright
- 构建编排：pnpm workspace + Turbo

## 2. Monorepo 分层
- `apps/web`：Web 站点（Vite）
- `apps/mobile`：Taro 多端应用（H5/微信小程序/RN/鸿蒙配置预留）
- `apps/desktop-tauri`：桌面壳（复用 web 构建产物）
- `packages/ui`：共享 UI 组件
- `packages/store`：全局状态（购物车、用户会话）
- `packages/api-client`：接口定义 + Query Hooks
- `packages/mock`：OpenAPI、mock 数据与 MSW handlers

## 3. 前后端边界与迁移策略
### 当前阶段（Mock）
1. OpenAPI 定义业务契约（`packages/mock/openapi/mall.yaml`）
2. 使用 `mock/*.json` 作为模拟数据源
3. MSW 在开发环境拦截请求，返回与契约一致的数据

### 迁移真实后端
1. 保持 OpenAPI 作为单一契约源
2. 切换 `VITE_API_BASE_URL` 到真实网关
3. 关闭 MSW（`VITE_USE_MSW=false`）
4. 通过契约测试检查字段兼容性

## 4. 工程标准
- 统一 TS 严格模式
- 共享 lint / prettier / commit 规范
- PR 必须通过 lint + typecheck + test + build
- 版本管理采用 semver，从 `v0.1.0` 开始
