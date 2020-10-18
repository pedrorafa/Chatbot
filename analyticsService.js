require('dotenv').config({ silent: true });
const mongo = require('./mongoDbDataConnection')
const helper = require('./watson/skillHelper')

const bcrypt = require('bcrypt');
const groupBy = (collection, property) => {
    var i = 0, val, index,
        values = [], result = [];
    for (; i < collection.length; i++) {
        val = collection[i][property];
        index = values.indexOf(val);
        if (index > -1)
            result[index].push(collection[i]);
        else {
            values.push(val);
            result.push([collection[i]]);
        }
    }
    return result;
}

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

        let aux = groupBy(msg, 'intent')

        let result = []

        aux.forEach(i =>{
            result.push({
                Description: i[0].intent,
                Messages: i
            })
        })

        return result

    },

    getReportDialogToCsv: async () => {
        return await helper.reportDialogToCsv()
    }
}