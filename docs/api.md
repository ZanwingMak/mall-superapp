# API 文档（v0.2.0）

OpenAPI: `packages/mock/openapi/mall.yaml`

## 已完成接口
- `GET /api/products`
- `GET /api/coupons`
- `GET /api/addresses`
- `GET /api/orders`
- `POST /api/checkout`

## 契约演进策略
- 当前使用 MSW + JSON mock 驱动前端开发。
- 字段命名与响应结构优先保持稳定，便于迁移真实后端。
- 后续接入真实后端时，优先替换 request baseURL，不改动页面层调用签名。
