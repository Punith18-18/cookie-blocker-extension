# Contributing to CookieBlocker

Thanks for your interest! A few guidelines to make contributions simple and consistent:

- Open an issue first for non-trivial changes or new heuristics.
- Add demo HTML under `demo/` showing the banner case you want to support.
- Keep heuristics conservative: prefer clicking explicit accept buttons, avoid anchors with hrefs, and add a test/demo when possible.
- Follow existing style and add comments explaining why a heuristic is safe.
- Run `npm ci` and `npm run test-demo` if you add tests.
