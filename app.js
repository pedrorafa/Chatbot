// var msBot = require('./microsoftBotFramework')
var telBot = require('./telegramBot')
var watson = require('./watsonConversation')

var restify = require('restify');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
server.get('/',(req, res, next) => { res.send('This server is a channel to LGPD - Bot')})

telBot.start((msg) => {
    watson.responseUser(msg.text, (response) => {
        console.log(response)
        telBot.send(response)
    })
})



// var json = require('./watson/skill-V2.json')
// console.log(json)