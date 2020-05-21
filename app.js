//var msBot = require('./microsoftBotFramework')
var telBot = require('./telegramBot')
var watson = require('./watsonConversation')

telBot.start((session) => {
    watson.responseUser(session.message.text, (response) => {
        console.log(response)
        session.send(response.generic[0].text)
    })
})