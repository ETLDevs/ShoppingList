const express = require('express');
const router = express.Router();
const {getList, searchItemOnList,  checkedNotOnList, allNotOnList,  updateList, deleteSavedItem, deleteChecked, deleteAllList} = require('../controllers/listController')

router.get('/', getList);
router.get('/:name', searchItemOnList);
router.patch('/:id', updateList);
router.delete('/checked', deleteChecked);
router.delete('/all', deleteAllList);
router.delete('/:id', deleteSavedItem);

module.exports = router;