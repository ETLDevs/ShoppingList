const { MongoClient } = require('mongodb')
const uri = 'mongodb+srv://ETLb:ETLb115656@shoppinglist.islnxj0.mongodb.net/shoppinglist'
let dbConnection

module.exports = {
    connectToDb: (cb) => {
        MongoClient.connect(uri)
        .then((client) => {
            dbConnection = client.db()
            return cb()
        })
        .catch(err => {
            console.log(err)
        })
    },
    getDb: () => dbConnection
}