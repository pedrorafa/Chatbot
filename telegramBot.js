require('dotenv').config({ silent: true });
var tbot = require('node-telegram-bot-api');

var watsonTelBot = require('./watsonConversation')
var telegramBot = new tbot(process.env.API_TOKEN_TELEGRAM, { polling: true });

initBot = () => {
    watsonTelBot.getSession()

    telegramBot.onText(/\/start/, (msg) => {
        let welcome = 'Oi, consigo responder dúvidas sobre a LGPD'
        welcome += '\n\nInformamos que gravamos as mensagens de nossa conversa, com a única finalidade de me atualizar sobre os assuntos mais relevantes e aprimorar meus conhecimentos'
                    +'\nNão salvamos nenhuma identificação do usuário'
                    +'\nAs mensagens aqui não serão compartilhadas para nenhum terceiro e apenas serão utilizadas conforme já referido para consulta e apagadas após um período de 1 mês'
                    +'\nEsteja ciente que ao utilizar o chat-bot, você concorda com esse compartilhamento e não é permitido a informação de dados pessoais'
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