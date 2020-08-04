const MongoClient = require('mongodb').MongoClient
require('dotenv').config({ silent: true });

const dbName = process.env.DB_NAME
const uri = process.env.DB_CONNECTION

let db = undefined

MongoClient.connect(uri, (err, client) => {
  if (err) return console.log(err)

  db = client.db(dbName)
})

saveMessage = (payload) => {
  db.collection('messages').save(payload, (err, result) => {
    if (err) return console.log(err)
  })
}

module.exports = {
  saveMessage: (payload) => saveMessage(payload)
}