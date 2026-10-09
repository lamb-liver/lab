# Repo 維護紀錄

> 分支與 PR 整理、CI／部署的注意事項。已完成的整理不需重做。

## 2026-10-10 PR 與分支整理

整理時間：2026-10-10 01:29–01:35（台北時間）。整理後 **沒有開啟中的 PR，遠端只剩 `main`**（沒有受保護分支；`main` 未動）。

### 開啟中的 PR

整理時只有 #82（中文作品卡標題斷行），已經使用者同意並 squash merge。沒有 draft PR，沒有需要關閉的 PR。

### 刪除的遠端分支（33 個，一般刪除，未 force-push）

- **32 個是已合併 PR 的分支**：都是 squash merge，分支最後一個 commit 與 PR 合併時的 head 完全相同，沒有合併後才推上去的工作。
- **`feat/english-pages`（沒有 PR）**：2026-10-08 的英文頁初版（4 個 commit），後來拆成 i18n 系列 #58–#74 合併。它改過的 365 個檔案在 main 都存在，抽查的檔案內容相同或已在 main 後續修改，已被取代。

需要找回時，可用下表的 commit 重建分支（`git push origin <sha>:refs/heads/<branch>`；GitHub 會保留這些 commit）。

| 分支 | 最後 commit | 對應 PR |
|------|-------------|---------|
| feat/amc12-exams | 6e3e309b | #53 |
| feat/ast-115-114-math-jia-exams | 2c23dc63 | #43 |
| feat/en-og | 6d445dfc | #78 |
| feat/english-pages | 5a5d4a57 | 無（被 #58–#74 取代） |
| feat/gradient-complex-powers | 71a63397 | #44 |
| feat/zh-og-formula-glyphs | 92d1e3ee | #79 |
| feat/zh-og-formula-oneline | f313653c | #81 |
| feat/zh-og-title-break | 61823f8f | #82 |
| feat/zh-og-titled-cards | 3c7e7811 | #80 |
| fix/en-prose-audit | 7f70fd76 | #75 |
| fix/en-prose-nits | f989a691 | #76 |
| fix/font-subset-scan | e1cdef8d | #54 |
| fix/p5-host-no-remount-flicker | 3521cae8 | #46 |
| fix/p5-resize-observer-clear | 1cb543b6 | #47 |
| fix/parallelogram-button-flicker | 6ea89e65 | #45 |
| fix/zh-copy-accuracy | 256d1959 | #57 |
| i18n/1-infra | 15beac8a | #58 |
| i18n/2-works-interactive | 47695ebc | #59 |
| i18n/3-explore-exam-interactive | f857d39a | #60 |
| i18n/4-works-content | fd5efb38 | #61 |
| i18n/5-explore-exam-content | c91a8bd2 | #62 |
| i18n/6-works-remaining | a75b5991 | #63 |
| i18n/7-explore-remaining | 7fd9b63a | #64 |
| i18n/8-exam-remaining | a6bf46a9 | #65 |
| i18n/9-en-index-pages | 3f9c038a | #66 |
| i18n/10-en-chrome | bc30e918 | #67 |
| i18n/11-official-terms | e173756a | #68 |
| i18n/12-en-concept | 7ee21388 | #69 |
| i18n/13-en-paths | a37f8485 | #70 |
| i18n/14-en-about-nav | 45b5655f | #71 |
| i18n/15-lang-toggle | 6d832235 | #72 |
| i18n/16-bilingual-audit-fixes | 03c32eb4 | #73 |
| i18n/17-bilingual-parity | 3e140b84 | #74 |

## main 的 CI 與部署

- `c58c0c9`（#80 合併）推上 main 後，**GitHub Actions CI 與 Vercel 都沒有被觸發**（push 事件沒有送出）。等了 13 分鐘後，以 Vercel 手動部署同一個 commit 到 production（`dpl_CFGgB7USShrcwR59D3Uuq4BXEFWc`）。這個 commit 在 main 上沒有 CI 紀錄，但相同內容已在 #80 的 PR CI 通過。
- 之後的 `6b502ed`（#81）與 `58b6331`（#82）都自動觸發 CI 與 Vercel，CI 全綠，正式站部署 READY。

## 流程注意事項

- **CI 觸發條件**（`.github/workflows/`）：push 到 `main`、對 `main` 開的 PR、以及手動 `workflow_dispatch`。其他分支單獨 push 不會跑 CI；要驗證請開 PR 到 main。
- **合併後先確認部署**：合併後到 Vercel（或 `gh api repos/lamb-liver/lab/commits/<sha>/status`）確認該 commit 有 production 部署。偶爾 push 事件會漏掉（如上）；等幾分鐘仍沒有時，**部署該 merge commit 本身**（不要部署其他 commit），並對 main 手動跑一次 CI（`gh workflow run` 或 Actions 頁面的 Run workflow）。
- **合併方式**：squash merge；合併後刪除功能分支，讓遠端只剩 `main`。不 force-push。
- **preview 受保護**：Vercel preview 需要分享連結（Vercel 的「Share」或 API 的 shareable URL）才能從外部抓取。
