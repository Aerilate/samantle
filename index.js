import puppeteer from 'puppeteer';

const url = "https://semantle.com"

async function main() {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  await page.goto(url);
  await page.setViewport({width: 1080, height: 1024});

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
  console.log(code)
  await browser.close();
};

main();
