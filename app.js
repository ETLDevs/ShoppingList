const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const ejs = require('ejs');
const grocerieRouter = require('./routes/grocerieRoutes')
const app = express();
const port = 3000;
const URI = process.env.DB_URI;

const Grocerie = require('./models/grocerie')

mongoose.connect(URI)
.then(() => {
    app.listen(port, () => {
        console.log(`app listening on port ${port}`)
    })
})
.catch((err) => {
    console.log(`mongooseConnect ERROR: ${err}`);
})

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors());
app.use(morgan('dev'));
app.use(express.static('public'));

app.get('/', (req, res) => res.render('index'));
app.use('/', grocerieRouter);

// app.get(`/groceries/:name`, async (req, res) => {
//     try {   
//     const item = await db.collection('groceries')
//         .find({name: req.params.name}, {projection: {icon: 1, type: 1}})
//         .toArray()
//         res.status(200).json(item);
//     } catch (error) { 
//         res.json(error);
//         }
// })

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

