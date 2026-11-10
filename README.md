# puppy手帐｜和 puppy 一起变得更好 ♡

## 运行

无需安装依赖。需要 Python 3：

```sh
cd '/Users/rinkou/Documents/ChatGPT/1000project 2/puppy-journal'
python3 -m http.server 8765 --bind 127.0.0.1 --directory dist
```

打开 http://127.0.0.1:8765 。按 Ctrl+C 关闭。

## 使用

- 首页：每个挑战一条，包含累计 / 目标、百分比、今日与剩余数量。
- +1 / +10 / +20 快捷打卡；平板支撑支持 +30秒 / +1分钟 / +2分钟。
- 自定义可输入数量或时长、选择过去日期。
- 条目右侧依次为记录、编辑、删除。首页顶部「新增」添加挑战。
- 记录支持修改、删除；最近一次操作可用提示中的「撤销」恢复。
- 统计：各项累计、最近七天、本周与上周对比。

仅首页和统计两个入口，无独立管理页，无备份导入导出。

## 保存

当前设备、当前浏览器的 IndexedDB 自动保存，关闭再打开仍保留。不同网址、端口和浏览器的数据独立，不会自动同步。清理网站数据会删除记录。

数据模型保持不变，现有记录继续可用；没有更换数据库或自动重置记录。
平板支撑用整数秒保存；日期按 Asia/Tokyo 计算。

## GitHub Pages

`dist/` 为完整静态网站，资源使用相对路径，可以放在 GitHub Pages 仓库根目录或子路径。
仓库：`https://github.com/rinkou666/puppy-journal`。发布目标：`https://rinkou666.github.io/puppy-journal/`。在 GitHub 仓库 Settings → Pages 选择 GitHub Actions 后，工作流会发布 dist/。

## 测试

```sh
node --test tests/model.test.mjs
node --check dist/app.js
```

原生 HTML / CSS / JavaScript，无需打包；`dist/` 可直接部署。

## 手机主屏幕（PWA）

发布到 HTTPS 正式网址后：

- iPhone / iPad：Safari 打开网址 → 分享 → 添加到主屏幕 → 添加。如有「作为网页 App 打开」，保持开启。
- 安卓：Chrome 打开网址 → 菜单 → 安装应用 / 添加到主屏幕。

安装后有 puppy 图标，使用独立窗口；首次联网加载完成缓存后可离线打卡。数据仍仅保存在当前设备，不会同步到电脑或另一台手机。实际手机安装需发布后测试；本机的 127.0.0.1 地址不能供手机直接访问。

PWA 文件：manifest.webmanifest、sw.js、各尺寸 PNG 图标。更新网站时同步修改 sw.js VERSION、ASSETS 和 HTML/模块版本号，确保缓存一致。
