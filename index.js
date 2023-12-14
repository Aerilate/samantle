const puppeteer = require("puppeteer");
const config = require("./config.json");
const { Events, Client, GatewayIntentBits } = require('discord.js');

const timeout = 5 * 1000
const baseURL = "https://semantle.com"
const path = (code) => { return `${baseURL}?jtg=${code}` }
const format = (msg) => { return `It's time for today's Semantle! \n ${msg}` }

async function getToken(msgSender) {
  const browser = await puppeteer.launch({
    headless: "new",
  });
  const page = await browser.newPage();
  await page.goto(baseURL, { waitUntil: 'networkidle0', timeout: 0 });

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

  const msg = path(code)
  console.log(`sending ${msg}`)
  await msgSender(msg)
  console.log('timer start')
  await new Promise(r => setTimeout(r, timeout));
  console.log('timer done')
  await browser.close();
};

async function sendDiscordMessage(msg) {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
    ]
  });
  client.once(Events.ClientReady, client => {
    const channel = client.channels.cache.get(config.channel)
    channel.send({ content: format(msg) })
  });
  client.login(config.token);
}

(async () => {
  await getToken(sendDiscordMessage);
  process.exit();
})();
