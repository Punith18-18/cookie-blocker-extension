// contentScript.js — improved, safe auto-dismiss of cookie popups
// Goals: avoid repeated clicks, avoid clicking anchors that change location/hash,
// debounce rapid DOM changes, and only act on likely cookie banners.

const defaultSelectors = [
  '[id*="cookie"]',
  '[class*="cookie"]',
  '[id*="consent"]',
  '[class*="consent"]',
  '[role="dialog"]',
  '[aria-modal="true"]'
];

const buttonSelector = 'button, input[type="button"], input[type="submit"], [role="button"]';
const acceptTexts = ["accept", "agree", "yes", "allow", "ok", "confirm", "continue", "got it", "save"];
const rejectTexts = ["reject", "decline", "deny", "no", "manage", "settings"];

function textMatches(nodeText, keywords) {
  if (!nodeText) return false;
  const txt = nodeText.toLowerCase().trim();
  return keywords.some(k => txt.includes(k));
}

function isVisible(el) {
  if (!el || !(el instanceof Element)) return false;
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return false;
  // also check computed style
  const style = window.getComputedStyle(el);
  if (style && (style.visibility === 'hidden' || style.display === 'none' || parseFloat(style.opacity || '1') === 0)) return false;
  return true;
}

// keep track of nodes we've already attempted to interact with
const processed = new WeakSet();
let actionCount = 0;
const MAX_ACTIONS = 6; // safety: avoid more than N interactions per page

function safeClick(node) {
  if (!node || processed.has(node) || actionCount >= MAX_ACTIONS) return false;
  // avoid clicking anchors that have an href (they often navigate or change hash)
  if (node.tagName && node.tagName.toLowerCase() === 'a') {
    const href = node.getAttribute('href');
    // only allow anchors that act like buttons (no href) or have role=button
    if (href && href.trim() !== '' && !href.startsWith('#') && !href.startsWith('javascript:')) return false;
  }
  if (!isVisible(node)) return false;
  try {
    processed.add(node);
    actionCount += 1;
    node.click();
    window.__cookieBlockerBlocked = (window.__cookieBlockerBlocked || 0) + 1;
    console.log('CookieBlocker: safe click ->', node, 'actions:', actionCount);
    // notify background for stats (guarded so demo pages or non-extension contexts won't throw)
    try {
      if (typeof chrome !== 'undefined' && chrome.runtime && typeof chrome.runtime.sendMessage === 'function') {
        chrome.runtime.sendMessage({ type: 'clicked' }, () => {});
      }
    } catch (e) { /* ignore */ }
    return true;
  } catch (e) {
    // ignore errors, but mark as processed to avoid repeat
    processed.add(node);
    return false;
  }
}

function isLikelyBanner(el) {
  if (!el || !(el instanceof Element)) return false;
  const txt = (el.innerText || '').toLowerCase();
  // quick keyword check
  if (!textMatches(txt, ["cookie", "cookies", "consent", "privacy", "gdpr"])) return false;
  // banners are often fixed or sticky near bottom/top, or dialogs
  const style = window.getComputedStyle(el);
  if (style.position === 'fixed' || style.position === 'sticky' || el.getAttribute('role') === 'dialog' || el.getAttribute('aria-modal') === 'true') return true;
  // if its bounding box is near bottom or top of viewport
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  if (rect.top < 120 || rect.bottom > vh - 120) return true;
  // fallback: if class/id contains cookie/consent
  const idClass = (el.id || '') + ' ' + (el.className || '');
  if (/cookie|consent|gdpr|privacy/i.test(idClass)) return true;
  return false;
}

function runScan() {
  if (actionCount >= MAX_ACTIONS) return;

  // 1) prefer actionable buttons that explicitly contain accept-like text
  const candidates = Array.from(document.querySelectorAll(buttonSelector));
  for (const btn of candidates) {
    try {
      const text = (btn.innerText || btn.value || btn.getAttribute('aria-label') || '').toLowerCase();
      if (!text) continue;
      if (textMatches(text, acceptTexts)) {
        if (safeClick(btn)) return;
      }
      // avoid auto-rejecting by default
    } catch (e) { /* ignore per-element errors */ }
  }

  // 2) look for banner containers and then look for buttons inside them
  for (const sel of defaultSelectors) {
    const els = Array.from(document.querySelectorAll(sel));
    for (const el of els) {
      try {
        if (!isLikelyBanner(el)) continue;
        // try find an inside button with accept text
        const insideBtns = Array.from(el.querySelectorAll(buttonSelector));
        for (const b of insideBtns) {
          const txt = (b.innerText || b.value || b.getAttribute('aria-label') || '').toLowerCase();
          if (textMatches(txt, acceptTexts)) { if (safeClick(b)) return; }
        }
        // fallback: try any visible button inside
        for (const b of insideBtns) { if (isVisible(b) && safeClick(b)) return; }
      } catch (e) { /* ignore per-element errors */ }
    }
  }
}

// debounce rapid calls from MutationObserver
let scanTimer = null;
function debouncedScan() {
  if (actionCount >= MAX_ACTIONS) return;
  if (scanTimer) clearTimeout(scanTimer);
  scanTimer = setTimeout(() => { runScan(); scanTimer = null; }, 300);
}

// observe page changes (many banners load late)
const observer = new MutationObserver((mutations) => {
  // only trigger when nodes are added or significant text changes occur
  for (const m of mutations) {
    if (m.addedNodes && m.addedNodes.length) { debouncedScan(); return; }
    if (m.type === 'childList') { debouncedScan(); return; }
  }
});
observer.observe(document.documentElement || document.body, { childList: true, subtree: true });

// initial tries with backoff
setTimeout(debouncedScan, 700);
setTimeout(debouncedScan, 2500);
setTimeout(debouncedScan, 8000);
