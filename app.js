//var msBot = require('./microsoftBotFramework')
var telBot = require('./telegramBot')
var watson = require('./watsonConversation')

telBot.start((msg) => {
    watson.responseUser(msg.text, (response) => {
        console.log(response)
        telBot.send(response)
    })
})