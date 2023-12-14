import { Events, Client, GatewayIntentBits } from 'discord.js';

const config = {
  channel: process.env.CHANNEL,
  token: process.env.TOKEN,
  baseMsg: process.env.MESSAGE || "It's time for today's Semantle!",
}

const format = (msg) => { return `${config.baseMsg}\n${msg}` }

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

export const handler = async (_) => {
  await getToken(sendDiscordMessage);
  process.exit();
};
