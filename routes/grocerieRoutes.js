const express = require('express');
const router = express.Router();
const {findAll, getList, searchItem, searchItemOnList, addItemToList,itemAddedToList, updateList, deleteSavedItem, deleteChecked, deleteAllList} = require('../controllers/grocerieController')


router.get('/', findAll);
// router.get('/')
router.get('/list', getList);
router.get('/:name', searchItem)
router.get('/list/:name', searchItemOnList)
router.post('/:id', addItemToList);
router.patch('/:id', itemAddedToList);
router.patch('/list/:id', updateList);
router.delete('/', deleteChecked)
router.delete('/list', deleteAllList)
router.delete('/:id', deleteSavedItem)

module.exports = router;