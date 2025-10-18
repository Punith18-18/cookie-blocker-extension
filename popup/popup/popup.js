function refresh() {
  chrome.storage.local.get(["dismissedCount","blockedTrackers"], (res) => {
    document.getElementById('dismissed').innerText = res.dismissedCount || 0;
    document.getElementById('blocked').innerText = res.blockedTrackers || 0;
  });
}
document.getElementById('clear').addEventListener('click', () => {
  chrome.storage.local.set({ dismissedCount: 0, blockedTrackers: 0 }, refresh);
});
refresh();
setInterval(refresh, 1500);
