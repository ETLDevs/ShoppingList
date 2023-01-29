var express = require('express');
var router = express.Router();
var {getDb} = require('../db');

router.get(`/`, async (req, res) => {
    console.log('route exacuted')
    try {   
       const item = await db.collection('groceries')
        .find({name: req.params.name}, {projection: {icon: 1, type: 1}})
        .toArray()
        console.log('success')
        res.status(200).json(item);
    } catch (error) { 
        console.log(`fail error${error}`)
        res.json(error);
        } 
})

module.exports = router;