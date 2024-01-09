const puppeteer = require("puppeteer");
const { Events, Client, GatewayIntentBits } = require('discord.js');
const creds = require("./creds.json")

const config = {
  token: creds.TOKEN,
  channel: creds.CHANNEL,
  baseMsg: process.env.MESSAGE || "Yee haw! It's time for today's Semantle!",
}

const urlRegular = "https://semantle.com"
const urlJunior = "https://semantle.com/junior"
const urlTeam = (baseURL, code) => { return `${baseURL}?jtg=${code}` }
const formatRegular = (msg) => { return `Yee haw! It's time for today's Semantle!\n${msg}` }
const formatJunior = (msg) => { return `And for today's junior!\n${msg}` }

async function startGame(url, formatFunc) {
  const browser = await puppeteer.launch({
      headless: false,
      protocolTimeout: 60 * 60 * 1000
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 0 });

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

  const msg = urlTeam(url, code)
  console.log(`sending ${msg}`)
  await sendDiscordMessage(formatFunc(msg))

  const winButton = ".animate-reveal"
  await page.waitForSelector(winButton, {timeout: 0});
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
    channel.send({ content: msg })
  });
  client.login(config.token);
}

(async function () {
  await startGame(urlRegular, formatRegular);
  console.log("regular completed")
  await startGame(urlJunior, formatJunior);
  console.log("junior completed")
  await sendDiscordMessage("Well done!")
})()
