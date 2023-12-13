import puppeteer from 'puppeteer';

const url = "https://semantle.com"
const path = (code) => { `${url}?jtg=${code}` }

async function main() {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  await page.goto(url, {waitUntil: 'networkidle0', timeout: 0});

  const closeButton = "#rules-close"
  await page.waitForSelector(closeButton);
  await page.click(closeButton);

  const cloudButton = "#cloud-button"
  await page.waitForSelector(cloudButton);
  await page.click(cloudButton);

  const startButton = "#start"
  await page.waitForSelector(startButton);
  await page.click(startButton);

  const textSelector = await page.waitForSelector('#team');
  const code = await textSelector?.evaluate(el => el.textContent);
  const result = path(code)
  console.log(result)
  await browser.close();
};

await main();
