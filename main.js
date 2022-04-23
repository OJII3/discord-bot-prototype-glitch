const http = require("http"); 
const discord = require("discord.js");
const axios = require("axios");
let client;

const connectDiscord = () => {
  client = new discord.Client();
  client.login(process.env.DISCORD_BOT_TOKEN);
  client.on("ready", () => console.log("bot is ready!"));
  client.on("message", (message) => !message.author.bot ? sendGAS(message) : "");

  if (process.env.DISCORD_BOT_TOKEN == undefined) {
    console.log("please set ENV: DISCORD_BOT_TOKEN");
    process.exit(0);
  }
};

// send
const sendGAS = (message) => {
  const jsonData = {
    author: message.author.id,
    content: message.content,
    channelId: message.channel.id,
  };
  const post = async () => {
    try {
      await axios({
        method: "post",
        url: process.env.GAS_URL,
        data: jsonData,
        responseType: "json",
      }).then((response) => {
        const msg = response.data;
        
        //送信方法
        switch (msg.messagetype) {
          case "nothing":
            break;

          case "reply":
            message.reply(msg.content);
            break;

          case "send":
          default:
            message.channel.send(msg.content);
            break;
        }
      });
    } catch (error) {
      message.reply("an error occurred: " + error);
    }
  };
  post();
};

//Response for GAS post request
http
  .createServer( (request, response) => {
    console.log('post from gas')
    response.end("Discord bot is active now.");
  })
  .listen(3000);
connectDiscord();
