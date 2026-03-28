# 接口文档（OpenAPI + Mock）

契约文件：`packages/mock/openapi/mall.yaml`

## GET /api/products
- 描述：获取商品列表
- 返回：`Product[]`

```json
[
  { "id": "p1", "title": "Air Flex 运动鞋", "price": 399, "image": "https://..." }
]
```

## Mock 方案
- 数据源：`packages/mock/mock/products.json`
- 拦截层：`packages/mock/src/index.ts`（MSW handlers）
