# CookieBlocker

CookieBlocker is a lightweight, open-source Chrome/Edge extension that safely auto-dismisses cookie consent popups while preserving page behavior and layout.

The extension is intentionally conservative — it prefers explicit "accept" buttons, avoids anchors that cause navigation, debounces DOM updates, and tracks processed elements to avoid repeated interactions.

## Demo

Open `demo/test-banner.html` in your browser to try a demo page that simulates common cookie consent patterns. The demo includes a small shim so the content script can be loaded directly for local testing (no extension install required).

## Key features

- Heuristic banner detection using container attributes (role, aria-modal), position (fixed/sticky), and text keywords
- Debounced MutationObserver to prevent repeated, immediate reactions to DOM churn
- Safe click logic: checks visibility, avoids anchors with navigational hrefs, and tracks processed nodes via WeakSet
- MAX_ACTIONS safety limit to avoid runaway interactions

## Quick install (local / dev)

1. Clone the repo.
2. In Chrome/Edge: Extensions → Load unpacked → select this project folder.
3. Open `demo/test-banner.html` to verify behavior.

## Run demo tests (optional)

The repo includes a Puppeteer-based demo test that opens the local `demo/test-banner.html` and asserts banners are dismissed. Run locally if you want automated checks (may require Chromium download during install):

```powershell
npm ci
npm run test-demo
```

If local installation of Puppeteer fails on Windows due to permissions or antivirus locks, you can run the demo manually (instructions above) or rely on CI which runs on GitHub-hosted runners.

## Architecture and design notes

- `ContentScript.js` contains the detection and safe-dismiss logic. It guards `chrome.runtime` so it can run in the demo page directly.
- `Background.js` is a minimal service worker (logs installation and receives click stats).
- `rules.json` contains declarative net request rules for blocking common trackers (keeps extension extra-lightweight).

### Safety contracts
- Inputs: the current page DOM, mutations reported by MutationObserver.
- Outputs: at most `MAX_ACTIONS` clicks per page, optional message to background `{ type: 'clicked' }`.
- Error modes: per-element try/catches to avoid breaking the host page.

## Resume-ready bullets

- Built CookieBlocker — a Chrome extension that safely auto-dismisses cookie consent dialogs using debounced MutationObservers and element heuristics. (GitHub: link)
- Implemented non-intrusive automation that avoids navigation and limits interactions to prevent layout shifts on major news sites.

## Contributing

Please open issues or PRs. When adding detection heuristics, prefer non-invasive approaches and include demo cases in `demo/`.

## Release notes

See `RELEASE_NOTES.md` for a changelog and planned improvements.

## License

MIT — see `LICENSE`.
