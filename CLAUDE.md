# CLAUDE.md

AIoTFun.com：AIoT 开源项目画廊。玩法参考 heypcb.ai 的 Circuit World，但条目是"AI + 硬件"的完整项目，视觉跟随 logo，不照抄 heypcb 的品牌、文案和数据。

命令、页面路由、数据流程见 `README.md`。

## 约定

- 分类、平台、硬件角色、难度等枚举只在 `src/lib/taxonomy.ts` 定义；脚本、提示词、页面都从这里取值。改枚举后，已整理的数据可能需要重跑 `enrich`。
- 项目数据是 `data/projects/<owner>--<repo>.json`。被拒的项目也保留文件，防止重复抓取。不要手工删除。
- `pnpm enrich` 调用收费 API，每个项目 1 次。批量运行前先向用户报批调用次数。
- 详情页只放大模型写的摘要和仓库链接，不搬运 README 正文和图片。
- 卡片主图是 `src/lib/card-svg.ts` 生成的结构卡，不用仓库里的图片。
- 前端交互用原生 TypeScript，不引前端框架。localStorage 读写一律 try/catch。
- 点赞接口在 `src/pages/api/likes/`，用 `import { env } from 'cloudflare:workers'` 读 D1 绑定 `DB` 和密钥 `IP_SALT`。改 `wrangler.jsonc` 后运行 `pnpm generate-types`。
- 数据脚本直接用 Node 运行 `.ts`（原生类型擦除），只能用可擦除的 TS 语法（不用 enum、namespace），相对导入要写 `.ts` 后缀。

## 设计

颜色取自 logo，定义在 `src/styles/global.css` 的 `@theme`：深青 `teal #073431`、翠绿 `accent #1ea97f`、米白底 `paper #faf9f5`。只做浅色模式。
