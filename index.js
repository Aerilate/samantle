const puppeteer = require("puppeteer");
const config = require("./config.json");
const {Events, Client, GatewayIntentBits } = require('discord.js');

const baseURL = "https://semantle.com"
const path = (code) => { return `${baseURL}?jtg=${code}` }

async function getToken() {
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
  const result = path(code)
  console.log(result)
  await browser.close();
  return result;
};

async function sendDiscordMessage(url) {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
    ]
  });
  client.once(Events.ClientReady, client => {
    const channel = client.channels.cache.get(config.channel)
    channel.send({content: url})
  });
  client.login(config.token);
}

(async () => {
  const semantle = await getToken();
  await sendDiscordMessage(`It's time for today's Semantle! ${semantle}`)
})();
