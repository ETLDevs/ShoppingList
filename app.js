const express = require('express');
const { ObjectId } = require('mongodb');
const cors = require('cors');
const { connectToDb, getDb } = require('./db');
const app = express();
const port = 3000;
let db;

app.use(express.json())
app.use(cors());

connectToDb((err) => {
   if (!err){
    app.listen(port, () => {
        console.log('app listening on port 3000')
    }); 
    db = getDb()}
})

app.get(`/groceries/:name`, async (req, res) => {
    try {   
    const item = await db.collection('groceries')
        .find({name: req.params.name}, {projection: {icon: 1, type: 1}})
        .toArray()
        res.status(200).json(item);
        console.log("IM TRY")
    } catch (error) { 
        console.log("IM CATCH")
        res.json(error);
        }
})
// app.post('/groceries', (req, res) => {
// const item = req.body
// db.collection('groceries')
// .insertOne(item)
// .then(result => {
//   res.status(201).json(result)  
// })
// .catch(err => {
//     res.status(500).json({error: "cant post your item"})
// })
// })

// app.patch('/groceries/:type', (req, res) => {
//     const updates = req.body;
//         db.collection('groceries')
//         .updateMany({type: req.params.type}, {$set: updates })
//         .then(result => {
//             res.status(200).json(result)
//         })
//         .catch(err => {
//             res.status(500).json({error: "could not update the item"})
//         })
// })

