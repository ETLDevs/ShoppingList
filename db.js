const { MongoClient } = require('mongodb')
require('dotenv').config();
const URI = process.env.DB_URI;

let dbConnection

// module.exports = {
//     connectToDb: (cb) => {
//         MongoClient.connect(URI)
//         .then((client) => {
//             dbConnection = client.db()
//             return cb()
//         })
//         .catch(err => {
//             console.log(err)
//         })
//     },
//     getDb: () => dbConnection
// }

module.exports = {
    connectToDb: async (cb) => {
        try {
        const client = await MongoClient.connect(URI);
        dbConnection = client.db()
        return cb()
    } catch { err => 
            console.log(err)
        }
    },
    getDb: () => dbConnection
}