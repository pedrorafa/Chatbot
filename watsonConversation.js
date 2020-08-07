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
            sessionId = res.result.session_id;
            return sessionId
        })
        .catch(err => {
            console.log(err); // something went wrong
            return 0
        });
}

const endQuestions = [
    '\nNo que posso te ajudar?',
    '\nPosso ajudar em mais algo?',
    '\nTem mais alguma dúvida?'
]
getEndQuestions = () => {
    let min = Math.ceil(0);
    let max = Math.floor(endQuestions.length);
    let index = Math.floor(Math.random() * (max - min)) + min;

    return endQuestions[index]
}

//assistant Response to user treat
responseUserInput = (sessionMsg, sessionId, sendFunction) => {
    var assistantContext = findOrCreateContext(sessionId);
    if (!assistantContext)
        assistantContext = {};

    var payload = {
        assistantId: assistantId,
        sessionId: sessionId,
        context: assistantContext.watsonContext,
        input: { text: sessionMsg }
    };

    assistant.message(payload)
        .then(response => {
            let output = response.result.output.generic[0].text || 'Desculpa, mas não tenho resposta para isso no momento';

            if (response.result.output.intents.find(e => e.intent != 'General_Ending'))
                output += getEndQuestions()

            sendFunction(output);
            assistantContext.watsonContext = response.context;

            let message = {
                sessionId: payload.sessionId,
                input: payload.input.text,
                intents: response.result.output.intents,
                entities: response.result.output.entities,
                output: output
            }
            mongo.saveMessage(message)
        })
        .catch(err => {
            getSession().then(data => {
                responseUserInput(sessionMsg, data, sendFunction)
            });
            mongo.saveError(err)
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
    sessionExpired: assistant,
    getSession: () => getSession(),
    responseUser: (sessionMsg, sessionId, sendFunction) =>
        responseUserInput(sessionMsg, sessionId, sendFunction)
}