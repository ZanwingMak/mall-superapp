# Mall SuperApp (v0.5.0)

高完成度商城前台演示（Web 主交付），覆盖完整电商主链路：浏览 → 详情 → 加购/立即购买 → 结算 → 下单成功 → 订单查看。

## 本版亮点
- 首页重构：顶部导航/搜索、轮播 Banner、活动专区、分类宫格、热门榜单、新人专区。
- 商品链路：详情页图文+规格选择+库存+评价预览，支持加入购物车反馈与立即购买直达结算。
- 购物车与结算：全选/删除/数量增减/失效商品、优惠券、地址入口、运费、备注、价格明细。
- 个人中心：会员卡片、订单入口、订单状态筛选、收藏页、地址管理页。
- 新增能力：商品对比、智能排序、活动详情展开、消息通知中心、浏览足迹、发票信息、售后申请入口。
- v0.5.0 强化：首页快讯/会员商业位、详情页多图预览+评价筛选+同类推荐、购物车边界态（失效清理/99件上限）、结算条款校验、个人中心资料编辑+服务中心。
- 视觉系统：设计 token（色板/阴影/圆角/间距）、统一按钮/卡片/标签/空状态/骨架屏、toast 状态反馈，补充 hover/active 微交互。
- API 与 Mock：OpenAPI 扩展为首页与详情链路，MSW + JSON mock 可平滑迁移真实后端。

## 关键页面路径（Web）
- `/` 首页
- `/product/:id` 商品详情
- `/cart` 购物车
- `/checkout` 结算页
- `/success` 下单成功
- `/me` 个人中心
- `/orders` 订单页
- `/favorites` 收藏页
- `/addresses` 地址管理
- `/notifications` 消息通知中心
- `/footprints` 浏览足迹

## 项目结构
- `apps/web` - Web 商城主应用（本次重点）
- `apps/mobile` - Taro 多端应用
- `apps/desktop-tauri` - Tauri 桌面壳
- `packages/ui` - 共享 UI 与视觉基础组件
- `packages/store` - Zustand 购物/收藏状态
- `packages/api-client` - API 与 Query hooks
- `packages/mock` - OpenAPI + Mock JSON + MSW

## 快速开始
```bash
pnpm install
pnpm --filter @mall/web dev
```

## 测试与构建（Web）
```bash
pnpm --filter @mall/web test
pnpm --filter @mall/store test
pnpm --filter @mall/web build
pnpm --filter @mall/web e2e
```

## Node 兼容说明（Taro）
Taro 4.x 在 Node 25 下可能触发依赖解析异常，建议 Node 20：
- 本地：`nvm use 20` 或 `volta install node@20`
- Docker：`pnpm build:mobile:node20:docker`
