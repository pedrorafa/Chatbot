require('dotenv').config({ silent: true });
const mongo = require('./mongoDbDataConnection')
const helper = require('./watson/skillHelper')

const bcrypt = require('bcrypt');

module.exports = {
    register: async (user, pass) => {
        let hash = bcrypt.hash(pass,20)
        return await mongo.register(user, hash)        
    },
    login: async (user, pass) => {
        let hash = bcrypt.hash(pass,20)
        let login = await mongo.login(user, hash)
        
        return login;
    },
    getMessages: async () => {
        return await mongo.getMessages()
    },
    
    getReportDialogToCsv: async () => {
        return await helper.reportDialogToCsv()
    }
}