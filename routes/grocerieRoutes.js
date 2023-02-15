const express = require('express');
const router = express.Router();
const {findAll, searchItem, addItemToList, itemAddedToList} = require('../controllers/grocerieController')


router.get('/', findAll);
router.get('/:name', searchItem);
router.post('/:id', addItemToList);
router.patch('/:id', itemAddedToList);


module.exports = router;