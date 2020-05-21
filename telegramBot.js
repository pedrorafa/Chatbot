require('dotenv').config({ silent: true });
var restify = require('restify');
var tbot = require('node-telegram-bot-api');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

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