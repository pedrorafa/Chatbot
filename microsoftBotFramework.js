var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

//Create connector to microsoft framework bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users
server.post('/api/messages', connector.listen());

initBot = (responseFunction) => {
    if (typeof (responseFunction) !== 'function') {
        console.error("pass a response function for init bot!")
    }
    // Create local memory storage
    var inMemoryStorage = new builder.MemoryBotStorage();
    // Create your bot with a function to receive messages from the user
    var bot = new builder.UniversalBot(connector, responseFunction);
    bot.set('storage', inMemoryStorage);
}



module.exports = {
    start: (responseFunction) => {
        initBot(responseFunction)
    }
}