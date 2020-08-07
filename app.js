// var msBot = require('./microsoftBotFramework')
var telBot = require('./telegramBot')
var watson = require('./watsonConversation')

var restify = require('restify');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
server.use(restify.plugins.bodyParser({ mapParams: true }));
server.get('/', (req, res, next) => { res.send('This server is a channel to LGPD - Bot') })

server.get('/getSession', (req, res, next) => {
    watson.getSession().then(data => {
        res.send(data)
    })
})
server.post('/message', (req, res, next) => {
    watson.responseUser(req.body.input,
        req.body.sessionId,
        (response) => {
            res.send(response)
            actualSessionId = watson.sessionId
        })
})

telBot.start();