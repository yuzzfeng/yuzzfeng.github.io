# 论文题目维护

所有论文内容统一维护在 `topics.json`，列表和详情共用 `index.html`，由 `topics.js` 渲染。不需要新增 HTML，也不需要构建。

## 新增题目

1. 将图片放入 `thesis-topics/images/`，建议使用不含空格的英文文件名。
2. 在 `topics.json` 的 `topics` 数组里复制一个题目对象并修改内容。
3. 使用唯一、固定的 `id`（例如 `urban-routing`），不要因调整顺序而改 ID。
4. 将 `image.file` 设置为图片文件名，不需要填写路径。
   如需列表封面与正文配图不同，可增加 `cover` 对象，字段与 `image` 相同；列表使用 `cover`，正文仍使用 `image`。
5. `levels` 填写 `["Bachelor"]`、`["Master"]` 或 `["Bachelor", "Master"]`。
6. `tags` 填写下方标签目录中定义的 ID。保存后即可通过同一页面查看。

题目按 `topics` 数组顺序自动编号为 1、2、3……。筛选时保留原编号；重新排列数组后编号会更新，但链接保持不变。

详情链接示例：`/thesis-topics/?topic=urban-routing`。

最小题目示例（加入 `topics` 数组，注意对象之间用逗号）：

```json
{
  "id": "urban-routing",
  "title": {
    "de": "Räumliche Analyse urbaner Wege"
  },
  "levels": ["Bachelor", "Master"],
  "tags": ["spatial-analysis", "llm"],
  "image": {
    "file": "urban-routing.png",
    "alt": "Karte mit urbanen Routen"
  },
  "sections": [
    {
      "title": {"de": "Aufgaben"},
      "blocks": [
        {"type": "paragraph", "text": "Beschreibung der Forschungsfrage."},
        {"type": "list", "items": ["Bachelor: …", "Master: …"]}
      ]
    }
  ]
}
```

`image` 可省略；页面只显示德语，标题使用 `title.de`；图片来源可添加 `image.credit`，格式为 `{"text": "来源名称与许可", "url": "https://…"}`。`scopeNote` 可提供学位范围的详细说明。正文支持 `[链接文字](https://example.org/)`，无需 HTML。正文和标签均使用德语。

## 标签和筛选

在根级别 `tags` 数组定义标签，例如：

```json
{"id": "remote-sensing", "de": "Fernerkundung", "color": "teal"}
```

然后在对应题目的 `tags` 中添加 `"remote-sensing"`。顶部筛选按钮自动生成。学位按钮直接从题目的 `levels` 生成。

同一行多个标签采用“或”，学位与研究方向两行之间采用“且”。重置按钮清除全部选择。所有界面文案和内容只显示德语。

## 其他内容

- `page`：页面标题、说明、联系方式和通用标签。
- `filters`：筛选区文字与空结果提示。
- `history`：进行中、已完成论文；每项包含 `year`、`text`、`meta`。
- `legacyPaths`：旧页面地址对应的固定题目 ID。GitHub Pages 的 `404.html` 加载 `legacy.js`，自动跳转到新地址。新增题目无需添加旧地址。
- `topics.css`：统一布局样式。

旧的六个题目 HTML 和三个方向 HTML 已移除。旧图片路径保留以兼容已有引用，当前论文页面只读取 `images/` 内的图片。

## 本地检查

在仓库根目录运行：

```sh
node scripts/check-thesis-topics.cjs
python3 -m http.server 8000
```

打开 `http://localhost:8000/thesis-topics/`。页面使用 fetch 读取 JSON，不能通过双击 HTML 的 `file://` 地址预览。旧地址的兼容跳转依赖 GitHub Pages 的 404 机制，Python 的简单服务器不会自动模拟它。

标签的 `color` 可用 `blue`、`indigo`、`teal`、`violet`、`amber`、`rose`、`slate`；学位颜色在 `degreeColors` 中设置。视频使用正文块 `{"type":"video","file":"train_delay.mov","label":"Video zur Verspätungsentwicklung","fallback":"Ihr Browser kann dieses Video nicht wiedergeben."}`，在页面内播放，不显示下载链接。
