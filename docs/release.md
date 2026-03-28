# 发布说明（v0.2.0）

## 版本
- 当前版本：`v0.2.0`

## 发布动作
1. 更新版本号与变更日志
2. 创建 tag：`git tag v0.2.0`
3. 推送：`git push origin main --tags`

## 自动化
- `.github/workflows/release.yml`：构建 web/mobile 并上传 release 资产
- `.github/workflows/tauri.yml`：在 macOS + Windows 产出桌面包

## 产物
- web: `artifacts-web-dist-v0.2.0.tar.gz`
- mobile: `artifacts-mobile-weapp-dist-v0.2.0.tar.gz`
- tauri: 由 tauri-action 发布到 GitHub Release
