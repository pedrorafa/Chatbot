require('dotenv').config({ silent: true });
var tbot = require('node-telegram-bot-api');

var telegramBot = new tbot(process.env.API_TOKEN_TELEGRAM, { polling: true });

var chatId = null;

initBot = (responseFunction) => {
    if (typeof (responseFunction) !== 'function') {
        console.error("pass a response function for init bot!")
    }
    telegramBot.on('message', (msg) => {
        chatId = msg.chat.id;
        responseFunction(msg);
    });
    telegramBot.on("polling_error", (err) => console.log(err));
}

sendMessage = (response) => {
    context = response.context;
    console.log(response)
    telegramBot.sendMessage(chatId, response.generic[0].text);
}

module.exports = {
    send: (response) => { sendMessage(response) },
    start: (responseFunction) => {
        initBot(responseFunction)
    }
}