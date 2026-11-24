# AIoTFun

好玩的 AIoT 项目画廊：收录 GitHub 上开源的 AI + 硬件项目，可以按货架浏览、在星图里逛、像刷卡片一样滑一滑。

线上地址：https://aiotfun.com

## 技术栈

- Astro 7（静态页为主）+ `@astrojs/cloudflare`，部署到 Cloudflare Workers
- Tailwind CSS 4
- Cloudflare D1：只存匿名点赞
- 项目数据：`data/projects/*.json`，一个项目一个文件，存在 git 里

## 数据流程

```
crawl（GitHub 搜索，免费） → enrich（大模型整理，收费） → review（人工审核） → build
```

| 命令 | 作用 |
|---|---|
| `pnpm crawl` | 搜索 GitHub，新仓库写成候选（`status: candidate`），README 缓存到 `.cache/readme/` |
| `pnpm enrich --limit N` | 用通义千问整理 N 个候选；**每个项目调用 1 次收费 API**，需要环境变量 `DASHSCOPE_API_KEY` |
| `pnpm review` | 终端里逐条审核：y 上架 / n 拒绝 / s 跳过 / o 打开 GitHub / q 退出 |

只有 `status: approved` 的项目会出现在网站上。

## 本地开发

```bash
pnpm install
pnpm db:migrate:local   # 建本地 D1 表
pnpm dev                # http://localhost:4321
```

本地点赞接口需要 `.dev.vars` 里有 `IP_SALT=任意字符串`。

## 页面

| 路由 | 内容 |
|---|---|
| `/` | 画廊首页：搜索 + 横滑货架 |
| `/shelf/[key]/` | 某个分类 / 平台 / 计算货架的全部项目 |
| `/p/[id]/` | 项目详情 |
| `/search/` | 搜索 |
| `/explore/` | 星图 |
| `/swipe/` | 滑一滑 |
| `/liked/` | 我喜欢的（存在本机浏览器） |
| `/api/likes`、`/api/likes/[id]` | 点赞接口（按需渲染，读写 D1） |
