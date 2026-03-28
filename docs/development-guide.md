# 开发规范

## 分支策略
- `main`：稳定发布分支
- `feat/*`：功能分支
- `fix/*`：修复分支

## 代码规范
- TypeScript strict
- 组件命名 PascalCase
- hooks 命名 useXxx
- 提交信息遵循 Conventional Commits

## 评审检查项
- 是否通过 lint / typecheck / test / build
- 是否补充文档和测试
- 是否兼容响应式布局
- Taro 相关改动是否在 Node 20 验证
- 桌面端改动是否经过 `apps/desktop-tauri/scripts/check-rust.sh` 与 CI 验证
