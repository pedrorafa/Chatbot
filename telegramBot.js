require('dotenv').config({ silent: true });
var tbot = require('node-telegram-bot-api');

var watsonTelBot = require('./watsonConversation')

var telegramBot = new tbot(process.env.API_TOKEN_TELEGRAM, { polling: true });

var chatId = null;

initBot = () => {
    telegramBot.on('poll', (msg) => {
        chatId = msg.chat.id;
        telegramBot.send('Novo pool');
    });
    telegramBot.on('message', (msg) => {
        chatId = msg.chat.id;
        
        watsonTelBot.responseUser(
            msg.text || 'Desculpa, mas não tenho resposta para isso no momento',
            watsonTelBot.sessionId,
            (response) => {
                sendMessage(response)
            })
    });
    telegramBot.on("polling_error", (err) => console.log(err));
}

sendMessage = (response) => {
    telegramBot.sendMessage(chatId, response);
}

module.exports = {
    send: (response) => { sendMessage(response) },
    start: () => { initBot() }
}