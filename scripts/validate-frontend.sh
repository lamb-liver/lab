#!/usr/bin/env bash
set -euo pipefail

PROJECT_NAME="羊·實驗"
DEFAULT_URL="http://127.0.0.1:4321/"

usage() {
  cat <<'USAGE'
Usage:
  npm run validate:frontend -- [--url URL] [--screenshot] [--skip-audit] [--skip-test] [--skip-dom]

Default validation order:
  1. npm run audit:content, unless --skip-audit is used
  2. npm test, unless --skip-test is used
  3. npm run build
  4. DOM verification only when --url is provided

Screenshots are opt-in. Use --screenshot only when visual evidence is needed.
USAGE
}

url=""
take_screenshot=0
skip_audit=0
skip_test=0
skip_dom=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --url)
      url="${2:-}"
      if [[ -z "$url" ]]; then
        echo "Missing value for --url" >&2
        exit 2
      fi
      shift 2
      ;;
    --screenshot)
      take_screenshot=1
      shift
      ;;
    --skip-audit)
      skip_audit=1
      shift
      ;;
    --skip-test)
      skip_test=1
      shift
      ;;
    --skip-dom)
      skip_dom=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

if [[ ! -f package.json ]]; then
  echo "package.json not found. Run from the project root." >&2
  exit 1
fi

has_script() {
  node -e "const p=require('./package.json'); process.exit(p.scripts && p.scripts['$1'] ? 0 : 1)"
}

run_step() {
  local label="$1"
  shift
  echo "== $label =="
  "$@"
}

if [[ "$skip_audit" -eq 1 ]]; then
  echo "== content audit =="
  echo "Skipped by --skip-audit"
elif has_script audit:content; then
  run_step "content audit" npm run audit:content
else
  echo "== content audit =="
  echo "No audit:content script found; skipped"
fi

if [[ "$skip_test" -eq 1 ]]; then
  echo "== test =="
  echo "Skipped by --skip-test"
elif has_script test; then
  run_step "test" npm test
else
  echo "== test =="
  echo "No test script found; skipped"
fi

run_step "build" npm run build

if [[ "$skip_dom" -eq 1 ]]; then
  echo "== DOM =="
  echo "Skipped by --skip-dom"
  exit 0
fi

if [[ -z "$url" ]]; then
  echo "== DOM =="
  echo "Skipped because --url was not provided."
  echo "Pass --url for DOM verification, for example: npm run validate:frontend -- --url $DEFAULT_URL"
  exit 0
fi

echo "== DOM =="
if ! node -e "require.resolve('playwright')" >/dev/null 2>&1; then
  echo "Playwright is not installed in this project." >&2
  echo "Verify DOM with the browser tool instead, then report the checked route/elements." >&2
  echo "Use --skip-dom only when that manual DOM verification is intentionally handled outside this script." >&2
  exit 1
fi

VALIDATE_URL="$url" SCREENSHOT="$take_screenshot" node <<'NODE'
const { chromium } = require("playwright");

const url = process.env.VALIDATE_URL;
const takeScreenshot = process.env.SCREENSHOT === "1";

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const consoleErrors = [];

  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.goto(url, { waitUntil: "networkidle" });
  await page.locator("body").waitFor({ state: "visible" });

  const bodyText = await page.locator("body").innerText();
  const canvasCount = await page.locator("canvas").count();
  const imageCount = await page.locator("img").count();

  if (!bodyText.trim() && canvasCount === 0 && imageCount === 0) {
    throw new Error("DOM check failed: no visible text, canvas, or image content found.");
  }

  if (consoleErrors.length) {
    throw new Error(`DOM check failed: console errors:\n${consoleErrors.join("\n")}`);
  }

  if (takeScreenshot) {
    await page.screenshot({ path: "validation-screenshot.png", fullPage: true });
    console.log("Screenshot saved to validation-screenshot.png");
  } else {
    console.log("Screenshot skipped; DOM evidence was sufficient.");
  }

  await browser.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
NODE
