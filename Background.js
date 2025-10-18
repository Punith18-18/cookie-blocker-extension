chrome.runtime.onInstalled.addListener(() => {
  console.log("✅ CookieBlocker installed and running!");
});

chrome.action.onClicked.addListener((tab) => {
  console.log("🔍 CookieBlocker manually activated on:", tab.url);
});

// Log to confirm background service worker is active
console.log("🚀 CookieBlocker background worker active");
