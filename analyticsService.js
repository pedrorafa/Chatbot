require('dotenv').config({ silent: true });
const mongo = require('./mongoDbDataConnection')
const helper = require('./watson/skillHelper')

const bcrypt = require('bcrypt');

module.exports = {
    register: async (user, pass) => {
        let hash = bcrypt.hash(pass, 20)
        return await mongo.register(user, hash)
    },
    login: async (user, pass) => {
        let hash = bcrypt.hash(pass, 20)
        let login = await mongo.login(user, hash)

        return login;
    },
    getMessages: async () => {
        let msg = await mongo.getMessages()

        let obj = []

        msg.forEach(m => {
            let aux = obj.find(i => i.Description === m.intent)
            if (!aux || !aux.Messages)
                aux = {
                    Description: m.intent,
                    Messages: []
                }
            aux.Messages.push(m);
            obj.push(aux);
        })

        return obj

    },

    getReportDialogToCsv: async () => {
        return await helper.reportDialogToCsv()
    }
}