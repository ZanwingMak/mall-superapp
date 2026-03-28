# API 文档（v0.4.0）

OpenAPI: `packages/mock/openapi/mall.yaml`

## 接口清单
- `GET /api/home` 首页聚合数据（banner/活动/榜单/新人专区）
- `GET /api/products` 商品列表
- `GET /api/products/{id}` 商品详情
- `GET /api/reviews?productId=` 商品评价
- `GET /api/coupons` 优惠券列表
- `GET /api/addresses` 收货地址列表
- `GET /api/orders?status=` 订单列表（all/pending/paid/shipping/done）
- `GET /api/notifications` 通知中心列表
- `GET /api/footprints` 浏览足迹
- `GET /api/campaigns/{id}` 活动详情（规则/亮点/时段）
- `POST /api/checkout` 提交订单（支持 invoice 信息）

## 契约演进策略
- 使用 MSW + JSON mock 驱动前端迭代，OpenAPI 作为单一契约源。
- 页面调用签名不依赖 mock 结构细节，便于迁移真实后端。
- 新增字段采用向后兼容策略（可选字段优先）。
