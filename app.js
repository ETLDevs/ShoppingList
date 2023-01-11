const express = require('express');
const { ObjectId } = require('mongodb');
const cors = require('cors');
const { connectToDb, getDb } = require('./db');
const app = express();
let db;

app.use(express.json())
app.use(cors());
connectToDb((err) => {
   if (!err){
    app.listen(3000, () => {
        console.log('app listenin on port 3000')
    }); 
    db = getDb()}
})

app.get(`/groceries/:name`, (req, res) => {
        db.collection('groceries')
        .findOne({name: req.params.name})
        .then(item => {
            res.status(200).json(item.icon)
        })
        .catch(err => {
            res.status(500).json({error: "ITEM NOT FOUND"})
        })
})

app.post('/groceries', (req, res) => {
const item = req.body
db.collection('groceries')
.insertOne(item)
.then(result => {
  res.status(201).json(result)  
})
.catch(err => {
    res.status(500).json({error: "cant post your item"})
})
})

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

