const MongoClient = require('mongodb').MongoClient
require('dotenv').config({ silent: true });

const dbName = process.env.DB_NAME
const uri = process.env.DB_CONNECTION

let db = undefined

MongoClient.connect(uri, (err, client) => {
  if (err) return console.log(err)

  db = client.db(dbName)
})

const saveMessage = (payload) => {
  db.collection('messages').save(payload, (err, result) => {
    if (err) return console.log(err)
  })
}
const saveError = (error) => {
  db.collection('error').save(error, (err, result) => {
    if (err) return console.log(err)
  })
}

const register = async (user, hash) => {
  return await db.collection('users').insert({user: user, hash: hash}, (err, result) => {
    if (err) return console.log(err)
    return result
  })
}
const login = async (user, hash) => {
  return await db.collection('users').find({user: user, hash: hash}).toArray()
}
const getMessages = async () => {
  return await db.collection('messages').find({}).toArray()
}

module.exports = {
  saveMessage: (payload) => saveMessage(payload),
  saveError: (error) => saveError(error),
  register: async (user, hash) => await register(user, hash),
  login: async (user, hash) => await login(user, hash),
  getMessages: async () => await getMessages()
}