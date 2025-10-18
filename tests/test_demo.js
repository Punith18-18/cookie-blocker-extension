const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  const filePath = path.resolve(__dirname, '../demo/test-banner.html');
  const fileUrl = 'file://' + filePath.replace(/\\/g, '/');

  console.log('Opening demo page:', fileUrl);
  await page.goto(fileUrl);

  // wait a short time for the content script to run and buttons to be clicked
  try {
    await page.waitForFunction(() => {
      const banners = Array.from(document.querySelectorAll('.cookie-banner'));
      if (!banners.length) return true;
      return banners.every(b => (b.offsetParent === null) || (getComputedStyle(b).display === 'none'));
    }, { timeout: 5000 });
    console.log('Demo test: banners dismissed — OK');
    await browser.close();
    process.exit(0);
  } catch (e) {
    console.error('Demo test: banners still present or timed out');
    await browser.screenshot({ path: 'tests/failure.png' });
    await browser.close();
    process.exit(1);
  }
})();