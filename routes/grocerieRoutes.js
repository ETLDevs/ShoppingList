const express = require('express');
const router = express.Router();
const {findItem} = require('./controllers/grocerieController')

console.log('hey')
router.get('/groceries/:name', findItem);

module.exports = router;