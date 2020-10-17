require('dotenv').config({ silent: true });
var tbot = require('node-telegram-bot-api');

var watsonTelBot = require('./watsonConversation')
var telegramBot = new tbot(process.env.API_TOKEN_TELEGRAM, { polling: true });

initBot = () => {
    watsonTelBot.getSession()

    telegramBot.onText(/\/start/, (msg) => {
        let welcome = 'Oi, consigo responder dúvidas sobre a LGPD'
        welcome += '\n\nGostaria de informar que gravamos as mensagens de nossa conversa, para me atualizar sobre os assuntos mais relevantes e aprimorar meus conhecimentos'
        telegramBot.sendMessage(msg.chat.id, welcome);
    });
    telegramBot.on('message', (msg) => {
        if (msg.text != '/start')
            watsonTelBot.responseUser(msg.text).then(result => {                
                telegramBot.sendMessage(msg.chat.id, result.text)
            })
    });
    telegramBot.on("polling_error", (err) => console.log(err));
}

module.exports = {
    start: () => { initBot() }
}