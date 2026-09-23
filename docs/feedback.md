# 回饋與留言

把站上 giscus 留言、社團討論與私訊，轉成可追蹤的 GitHub Issues。不自製留言或後台。

## 留言在哪

Works、Explore、Exam 詳情頁底部有 giscus，留言區進入視窗（或點「載入留言」）後才連第三方。Discussion 的 term 一律用帶結尾斜線的 pathname（`/works/foo/`），避免 `/works/foo` 與 `/works/foo/` 拆成兩串。對應 GitHub Discussions 的 **Announcements**。

安裝 [giscus GitHub App](https://github.com/apps/giscus) 到 `lamb-liver/lab` 後才能真正送出留言。

回覆原則：

- 當頁就能答的，直接在 Discussion 回。
- 要改內容、互動或站務的，開 Issue，並在原留言回連結。
- 騷擾或明顯離題：隱藏／鎖定討論，不必開 Issue。

## 何時開 Issue

開：

- 數學或互動錯誤（公式、退化情形、控制項與文案不符）
- 可重現的破版、觸控、效能
- 具體的內容缺口（缺哪一頁、哪一種讀法）
- 同一件事被兩處以上提到

不開：

- 「寫得很好」類讚賞（留在 Discussion）
- 無法對應到單一頁或單一行為的空泛建議
- 已有相同 open issue：在舊 issue 補來源即可

來源可以是 giscus、社團或私訊；標準相同。

## Issue 格式

用 [回饋 issue 模板](https://github.com/lamb-liver/lab/issues/new?template=feedback.yml)，或手動：

- **標題**：`[feedback] {短描述}`；能對到頁面時加 slug，例如 `[feedback] julia-set 改參數畫面空白`
- **label**：必加 `feedback`；再依情況加 `bug`、`area:works` / `area:explore`、`priority:P0|P1|P2`
- **本文**：來源、頁面 URL、原文摘錄、建議處理（若有）

## 優先級

| 級別 | 何時 |
|------|------|
| P0 | 公開頁數學錯誤、整頁無法用、資料遺失 |
| P1 | 手機無法操作、明顯破版、文案與畫面矛盾 |
| P2 | 文案潤飾、許願、低頻邊界 |

不確定就先 P2。

## 例子

**要開**

> giscus on `/works/julia-set`：「改 Re(c) 之後畫布空白十幾秒，沒有提示。」
>
> → `[feedback] julia-set 改參數畫面空白` · `feedback` `bug` `area:works` `priority:P1`

**不要開**

> 社團：「朱利亞集合好好看。」
>
> → 不必開 Issue。若要回，在原串說謝謝即可。

**合併**

> 私訊與 giscus 都說線性規劃可行域在窄螢幕被切到。
>
> → 開一則 `[feedback] linear-programming 窄螢幕裁切`，兩則來源都貼進去。
