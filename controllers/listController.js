const axios = require('axios');
const { Grocerie } = require("../models/grocerie");
const { SavedList } = require("../models/savedList");


const getList = async (req, res) => {
  try {
    const savedList = await SavedList.find().populate("item");
    res.render("list", { savedList });
  } catch (err) {
    res.status(500).json({ err: `getList ${err}` });
  }
};

const searchItemOnList = async (req, res) => {
  const name = req.params.name;
  try {
    const savedList = await SavedList.find().populate({
      path: "item",
      match: { name: { $regex: new RegExp(`^${name}`), $options: "i" } },
    });
    const html = await res.render("list", { savedList });
    res.send(html);
  } catch (err) {
    res.status(500).json({ err: `searchItemOnList ${err}` });
  }
};

const checkedNotOnList = async (req, res) => {
  try {
    const groceries = await SavedList.find({ checked: true }).populate("item");
    const promises = groceries.map((item) => {
      return Grocerie.updateOne(
        { name: item.item.name },
        { $set: { onList: false } }
      );
    });
    await Promise.all(promises);
    res.json();
  } catch (err) {
    res.status(500).json({ err: `checkedNotOnList ${err}` });
  }
};

const allNotOnList = async (req, res) => {
  try {
    const groceries = await SavedList.find({}).populate("item");
    const deleted = await Grocerie.updateMany({ groceries }, { onList: false });
    res.json(deleted);
  } catch (err) {
    res.status(500).json({ err: `allNotOnList ${err}` });
  }
};

const updateList = async (req, res) => {
  const _id = req.params.id;
  try {
    const update = await SavedList.findOneAndUpdate({ _id }, req.body);
    res.status(200).json({status: 'success'});
  } catch (err) {
    res.status(500).json({ err: `updateList ${err}` });
  }
};

const deleteSavedItem = async (req, res) => {
  const _id = req.params.id;
  const grocerieId = req.body.grocerieId
  try {
    const deleteItem =  SavedList.deleteOne({ _id});
    const findItem = await SavedList.findOne({_id}).populate('item');
    const notOnList = Grocerie.findOneAndUpdate({name: findItem.item.name}, {$set:{onList:false}});
    await Promise.all([deleteItem, notOnList])
    res.status(200).json({ status: "success"});
  } catch (err) {
    res.status(500).json({ err: `deleteSavedItem ${err}` });
  }
};

const deleteChecked = async (req, res) => {
  try {
   
    const deleteChecked =  SavedList.deleteMany({ checked: true });
    const findChecked = await SavedList.find({ checked: true }).populate("item");
    const checkedNotOnList = findChecked.map((item) => {
      return Grocerie.updateOne(
        { name: item.item.name },
        { $set: { onList: false } }
      );
    });
    await Promise.all([deleteChecked, ...checkedNotOnList]);
    res.status(200).json({ status: "success"});
  } catch (err) {
    res.status(500).json({ err: `deleteChecked ${err}` });
  }
};

const deleteAllList = async (req, res) => {
  try {
    const deleteAll = SavedList.deleteMany({});
    const allNotOnList = Grocerie.updateMany({onList: true}, {$set: {onList: false}})
await Promise.all([deleteAll, allNotOnList]);
    res.status(200).json({status:'success'});
  } catch (err) {
    res.status(500).json({ err: `deleteAllList ${err}` });
  }
};

module.exports = {
  getList,
  searchItemOnList,
  checkedNotOnList,
  allNotOnList,
  updateList,
  deleteSavedItem,
  deleteChecked,
  deleteAllList,
};
