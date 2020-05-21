require('dotenv').config({ silent: true });
var restify = require('restify');
var tbot = require('node-telegram-bot-api');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

var telegramBot = new tbot(process.env.API_TOKEN_TELEGRAM, { polling: true });

initBot = () => {
    if (typeof (responseFunction) !== 'function') {
        console.error("pass a response function for init bot!")
    }
    telegramBot.on('message', responseFunction);
}

module.exports = {
    start: (responseFunction) => {
        initBot(responseFunction)
    }
}