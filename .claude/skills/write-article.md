---
name: write-article
description: 单语中文个人站写作 skill。写文章或项目案例前先调用 —— 它定义语气、结构、frontmatter 和写作规则。
---

# AIoTFun 写作 Skill（单语中文站）

## 语气与身份

本站是Seek的个人独立开发者站。作者是Seek本人，不是 AI persona。你只是帮他把想法落成文字 —— 保留他的语气，不要套你的语气。

**语气基线**：工程师跟工程师讲人话。具体、好奇、偶尔自嘲。**不要** 公司腔、营销腔、AI 助手腔。

**判断标准**：每句话都问一遍 —— 这话工程师真的会跟同事讲吗？读起来像新闻稿、教程开场、AI 摘要的，全部重写。

## 事实准确性 —— 不可妥协

这是个招聘背书站。**捏造是最严重的失败模式**。

### 铁律

1. **不编造具体技术参数**：芯片型号、库版本、延迟数字、吞吐量、上线指标 —— 除非用户在本会话明确确认过，或仓库里能直接看到，否则不写。
2. **不编造社区引用**：引 Reddit / HN / GitHub 的话，链接必须真实存在，引文必须是原话或忠实转述。
3. **不编造结果数据**："服务 1 万商户"、"延迟降低 70%" —— 这些数字不能编。不知道就只在定性层级写（"线上运行"、"明显改善"）。
4. **不确定就标出来**："我猜瓶颈是 X" 可以，"瓶颈就是 X" 必须有依据。
5. **拿不准就问Seek，或者留 TODO**。一个 TODO 比一个自信的捏造好一万倍。

## 写文章还是写项目案例？

- **项目案例**（`src/content/projects/{slug}.mdx`）：一个项目的稳定 case study —— 为什么做、关键决策、踩过的坑、当前状态。偶尔更新。
- **写作**（`src/content/articles/{slug}.mdx`）：带时间戳的内容 —— 调试笔记、技术探究、观点、项目复盘。一旦发布，一般不再编辑。

## Article Frontmatter

```yaml
---
title: ""                # 钩住读者，不要"如何 X"/"教你 X"
description: ""          # 一句话，< 60 个汉字 / 120 chars
date: "YYYY-MM-DD"       # 在 AIoTFun 上发布的日期
cover: ""                # 可选。Unsplash URL 配 w=800&h=450&fit=crop
readingTime: 0           # 估算：约 300 chars/分钟（中文）
pinned: false            # 慎用，最多 1-2 篇
tags: []                 # 3-5 个 kebab-case 标签
---
```

**Cover 是可选的**。大多数个人写作不需要封面图。如果用，发布前 `curl -sI <url>` 验证返回 200 + `content-type: image/*`。

## Project Frontmatter

```yaml
---
title: ""                # 项目真实名字
oneLiner: ""             # 一句话：给谁用 + 解决什么
status: ""               # active | shipped | open-source | paused | archived
techStack: []            # 3-6 项即可，展示广度而非穷尽
cover: ""                # 可选
startDate: "YYYY-MM"     # 或只写 "YYYY"
endDate: "YYYY-MM"       # 可选，shipped/archived 项目用
repoUrl: ""              # 可选
liveUrl: ""              # 可选
featured: false          # 至多 4 个 featured，会出现在首页
order: 0                 # 越小越靠前。featured 用 1-4
tags: []
---
```

## Article Structure

没有固定模板。看主题决定形态。

常见有效形态：

- **调试笔记**：问题 → 试过什么 → 真正生效的是什么 → 之前我哪里想错了
- **探究**：我有的疑问 → 读了什么/测了什么 → 结论是什么
- **项目复盘**：做了什么 → 重做会怎么改 → 哪里出乎意料
- **观点**：主张 + 理由 + 我考虑过的反例

长度：通常 600 - 2000 字。够长到说出有具体内容，够短到 5 分钟看完。

## Project Case Study Structure

合理默认结构（按需调整）：

1. **这是什么** —— 一段，具体、清晰
2. **为什么自己做** —— 真实问题，不是 marketing 重新包装
3. **关键决策** —— 2-4 个 bullet，定义这个项目的选择
4. **取舍/踩坑** —— 哪里难、哪里没想到
5. **状态** —— 当前情况、链接

## 中文写作规则

- 主语言中文，code 和品牌名保留英文（`ESP32`、`Cloudflare`、`AIoTFun`、`Anthropic`）
- **绝不许翻译腔**。这站是中文原创，不是从英文翻过来的。每句读出来都得通顺。
- 比喻和类比用中文母语者熟悉的（"一顿外卖钱" 不是 "less than a pizza"，"机房级 GPU" 不是 "data-center-grade"）
- 标题点明角度，不卖关子。"为什么自己造一个 AI 闹钟" 比 "AI 闹钟" 好。
- 段落不要太长。3-5 行一段。

## 不要写

- 教程、step-by-step 指南 —— 自有专门教程站做这事
- 新闻稿式的产品 review
- 资讯综合 / 周报体
- 没有具体经验支撑的泛观点
- 任何缺少具体、难以伪造的细节的内容

## 发布前 Checklist

- [ ] 标题具体（不是"如何 X"）
- [ ] Frontmatter 通过 Zod schema
- [ ] Cover URL 用 `curl -sI` 验过（如果有 cover）
- [ ] 没有编造的指标 / 引用 / 芯片型号 / 上线数字
- [ ] 所有 TODO 标记已经处理完
- [ ] `pnpm build` 通过
- [ ] Slug 是 kebab-case
- [ ] 中文读起来不像翻译稿
