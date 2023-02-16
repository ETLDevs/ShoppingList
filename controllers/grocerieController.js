const axios = require('axios');
const { Category } = require("../models/category");
const { Grocerie } = require("../models/grocerie");
const { SavedList } = require("../models/savedList");

const findAll = async (req, res) => {
  try {
    const categories = await Category.find().populate("items");
    res.render("index", { categories });
  } catch (err) {
    res.status(500).json({ err: `findAll ${err}` });
  }
};

const searchItem = async (req, res) => {
  const name = req.params.name;
  try {
    const foundItems = await Grocerie.find({
      name: { $regex: new RegExp(`^${name}`), $options: "i" },
    }).limit(5);
    res.json(foundItems);
  } catch (err) {
    res.status(500).json({ err: `searchItem ${err}` });
  }
};

const addItemToList = async (req, res) => {
  const _id = req.params.id;
  try {
    const newItem = new SavedList({
      item: _id,
      quantity: 0,
      comments: "",
      checked: false,
    });
    const saveItem = newItem.save();
    const itemOnList = Grocerie.findOneAndUpdate({_id},{onList: true} );
    await Promise.all([newItem,saveItem, itemOnList])
    res.status(200).json({ status: "success" });
  } catch (err) {
    res.status(500).json({ err: `addItemToList ${err}` });
  }
};

const itemAddedToList = async (req, res) => {
  const _id = req.params.id;
  let result;
  try {
    const item = await Grocerie.findById(_id);
    result = await Grocerie.updateOne(
      { _id },
      { $set: { onList: !item.onList } }
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ err: `itemAddedToList ${err}` });
  }
};



module.exports = {
  findAll,
  searchItem,
  addItemToList,
  itemAddedToList,
};
