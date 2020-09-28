const telBot = require('./telegramBot')
telBot.start();

const watson = require('./watsonConversation')

const analytics = require('./analyticsService')

const restify = require('restify');
const jwt = require('jsonwebtoken');
const verifyJWT = (req, res, next) => {
    var token = req.headers.authorization.replace("Bearer ", "");
    if (!token) return res.send(401);

    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) return res.send(401);
        req.userId = decoded.id;
        next();
    });
}

// Setup Restify Server
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
server.use(restify.plugins.bodyParser({ mapParams: true }));
server.get('/', (req, res, next) => { res.send('This server is a channel to LGPD - Bot') })


server.post('/api/login', (req, res, next) => {
    analytics.login(req.body.user, req.body.pass)
        .then(data => {
            if (!data[0])
                return res.send(401)

            let token = jwt.sign(data[0], process.env.SECRET, {
                expiresIn: 300 // expires in 5min
            });
            res.send(token)
        })
})
server.post('/api/register', (req, res, next) => {
    console.log(req.body)
    analytics.register(req.body.user, req.body.pass)
        .then(data => res.send(data))
})
server.get('/api/messages', verifyJWT, (req, res, next) => {
    analytics.getMessages()
        .then(data => {
            res.send(data)
        })
})
server.get('/api/bot/reportDialog', verifyJWT, (req, res, next) => {
    analytics.getReportDialogToCsv()
        .then(data => {
            res.send(data)
        })
})

server.get('/getSession', (req, res, next) => {
    watson.getSession()
        .then(data => {
            res.send(data)
        })
        .catch(err => console.log(err))
})
server.post('/message', (req, res, next) => {
    watson.responseUser(req.body.input, req.body.sessionId)
        .then(data => {
            res.send(data)
        })
        .catch(err => console.log(err))
})

//SWAGGER
// var restifySwaggerJsdoc = require('restify-swagger-jsdoc');
// restifySwaggerJsdoc.createSwaggerPage({
//     title: 'API LGPDúvidas', 
//     version: '1.0.0', 
//     server: server, 
//     path: '/docs/swagger' 
// });