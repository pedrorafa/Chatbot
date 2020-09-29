require('dotenv').config({ silent: true });
const Assistant = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');

const mongo = require('./mongoDbDataConnection')

var contexts = undefined;
var sessionId = undefined;
var workspace = process.env.WORKSPACE_ID || '';
var assistantId = process.env.ASSISTANT_ID

const assistant = new Assistant({
    authenticator: new IamAuthenticator({ apikey: process.env.ASSISTANT_API_KEY }),
    version: '2018-09-19'
});

getSession = async () => {
    return await assistant.createSession({
        assistantId,
    })
        .then(res => {
            this.sessionId = res.result.session_id;
            return this.sessionId
        })
        .catch(err => {
            console.log(err); // something went wrong

            mongo.saveError(err)

            return ''
        });
}

const endQuestions = [
    'No que mais posso te ajudar?',
    'Posso ajudar em mais algo?',
    'Tem mais alguma dúvida?',
    'Quer perguntar mais alguma coisa?',
    'Tem mais dúvidas?',
    'Posso reposnder mais alguma questão?',
    'Como posso continuar te ajudando?',
    'Tem mais perguntas?',
    'O que mais gostaria de saber?'
]
getEndQuestions = () => {
    let min = Math.ceil(0);
    let max = Math.floor(endQuestions.length);
    let index = Math.floor(Math.random() * (max - min)) + min;

    return endQuestions[index]
}

//assistant Response to user treat
responseUserInput = async (sessionMsg, sessionId = undefined) => {
    sessionId = sessionId || this.sessionId || await getSession()

    var assistantContext = findOrCreateContext(sessionId);
    if (!assistantContext)
        assistantContext = {};

    var payload = {
        assistantId: assistantId,
        sessionId: sessionId,
        context: assistantContext.watsonContext,
        input: { text: sessionMsg }
    };

    return await assistant.message(payload)
        .then(response => {
            let output = '';
            if (response.result.output.generic)
                response.result.output.generic.forEach(o => {
                    output += (o.text || '') + '\n'
                });

            if (output === 'undefined\n' || output === '\n')
                output = 'Desculpa, mas não tenho resposta para isso no momento\n';

            let mainIntent = response.result.output.intents
                .find(i => i.confidence >= 0.6) || { intent: 'NotFound' };

            let message = {
                sessionId: payload.sessionId,
                input: payload.input.text,
                intent: mainIntent.intent,
                entities: response.result.output.entities,
                output: output
            }
            mongo.saveMessage(message);

            if (response.result.output.intents.find(e => e.intent != 'General_Ending'))
                output += getEndQuestions()

            assistantContext.watsonContext = response.context;
            return { text: output, sessionId: sessionId }
        })
        .catch(async err => {
            mongo.saveError(err)
            console.log(err)
            this.sessionId = undefined;
            return await responseUserInput(sessionMsg, undefined);
        });
}


//Find assistant context
findOrCreateContext = (convId) => {
    // Let’s see if we already have a session for the user convId
    if (!contexts)
        contexts = [];

    if (!contexts[convId]) {
        // No session found for user convId, let’s create a new one
        //with Michelin concervsation workspace by default
        contexts[convId] = { workspaceId: workspace, watsonContext: {} };
        //console.log (“new session : ” + convId);
    }
    return contexts[convId];
}

module.exports = {
    sessionId: sessionId,
    getSession: () => getSession(),
    responseUser: (sessionMsg, sessionId = undefined) =>
        responseUserInput(sessionMsg, sessionId)
}