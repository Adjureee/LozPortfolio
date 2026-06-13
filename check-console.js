const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    console.log('BROWSER CONSOLE:', msg.text());
  });

  page.on('pageerror', err => {
    console.log('BROWSER ERROR:', err.message);
  });

  console.log('Navigating to localhost:3000...');
  try {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 30000 });
    console.log('Page loaded. Waiting 5 seconds for 3D scene to initialize...');
    await new Promise(r => setTimeout(r, 5000));
  } catch(e) {
    console.error('Failed to load page:', e.message);
  }

  await browser.close();
})();
