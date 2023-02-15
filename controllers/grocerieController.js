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
  const id = req.params.id;
  try {
    const item = await Grocerie.findById(id);
    if (!item) return console.log("item Not Found");
    const savedItem = new SavedList({
      item: id,
      quantity: 0,
      comments: "",
      checked: false,
    });
    savedItem.save();
    await axios.patch(`http://localhost:3000/${id}`);
    res.json({ status: "Success", redirect: "/" });
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
