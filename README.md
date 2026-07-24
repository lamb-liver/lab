# 羊·實驗

數學視覺化與 Generative Art 的個人作品集。以 Astro 產生靜態網站，互動畫布由 React 與 p5.js 驅動。

[正式站](https://lab.lambliver.dev/) · [GitHub](https://github.com/lamb-liver/lab)

## 快速開始

需求：Node.js 22.12 以上。

```bash
npm ci
npm run dev
```

開啟 <http://localhost:4321/>。

## 常用指令

| 指令 | 用途 |
|------|------|
| `npm run dev` | 啟動本地開發環境 |
| `npm test` | 執行 Vitest |
| `npm run typecheck` | 執行 TypeScript 檢查 |
| `npm run build` | 建置靜態站到 `dist/` |
| `npm run validate:frontend -- --url <route>` | 依序執行內容檢查、測試、建置與 DOM 驗證 |
| `npm run audit:integration` | 驗證 content、registry 與 stage 接線 |
| `npm run audit:public-pages` | 列出公開／草稿 Works 與 Explore，並執行發布檢查 |
| `npm run validate:changed` | 依 Git 變更選擇聚焦驗證 |

需要視覺證據時才在 `validate:frontend` 後加 `--screenshot`。

## 架構

```text
src/
├── content/             # Works、Explore 與 Exam 的 Markdown
├── curve/               # Works 純幾何、參數與 registries（不依賴 p5／React）
├── explore/             # Explore 專屬幾何與 registries
├── exam/                # Exam 專屬數學與互動 registry
├── components/          # Astro shell、React roots、p5 hooks 與控制項
├── systems/rendering/   # 只接收 snapshot 的共用 renderer
└── pages/               # Works、Explore、Exam 與網站 shell routes
```

主要資料流：

```text
Works:   content → work registries → WorkInteractiveStage → CurveRoot → renderer
Explore: content → explore registry → ExploreInteractiveStage → ExploreRoot → renderer
Exam:    content → exam registry → ExamInteractiveStage → ExamRoot → renderer
```

Works、Explore 與 Exam 是三套獨立互動架構；新增頁面時必須同步各自的 content、registry 與 stage map。完整邊界見 [`docs/architecture.md`](docs/architecture.md)。

## 新增內容

```bash
npm run new:work -- <slug>
npm run new:explore -- <slug>
npm run new:exam -- <slug> --year 112 --subject 學測數A --type 多選 --no 11
```

產生器預設只建立草稿內容；`new:work` 加 `--interactive` 才會建立最小互動骨架並同步 registries。接線與發布流程：

- Works／Explore：[`docs/p5toreact.md`](docs/p5toreact.md)
- 內容格式：[`docs/textstyle.md`](docs/textstyle.md)
- 完整發布流程：[`docs/lab-release-system.md`](docs/lab-release-system.md)
- Exam 上線審查：[`docs/exam-visualization-plan.md`](docs/exam-visualization-plan.md)

## 部署

推送 `main` 後，[GitHub Actions](.github/workflows/deploy.yml) 會執行 `npm ci`、建置並部署 `dist/` 到 GitHub Pages。正式網域由 [`public/CNAME`](public/CNAME) 設定。

## 文件

文件索引在 [`docs/README.md`](docs/README.md)，AI／維護規範從 [`docs/AGENTS.md`](docs/AGENTS.md) 開始。當文件與實作不一致時，以 `src/` runtime 為準。

## 技術

Astro 6、React 19、p5.js、TypeScript、Vitest、Playwright、KaTeX；樣式為原生 CSS，沒有 UI framework。

## 聯絡

[lambliver.dev@gmail.com](mailto:lambliver.dev@gmail.com) · [lamb-liver](https://github.com/lamb-liver)
