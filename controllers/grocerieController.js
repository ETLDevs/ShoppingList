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

const getList = async (req, res) => {
  try {
    const savedList = await SavedList.find().populate("item");
    res.render("list", { savedList });
  } catch (err) {
    res.status(500).json({ err: `getList ${err}` });
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

const updateList = async (req, res) => {
  const _id = req.params.id;
  try {
    const update = await SavedList.findOneAndUpdate({ _id }, req.body);
    console.log("UPDATED");
    res.json(update);
  } catch (err) {
    res.status(500).json({ err: `updateList ${err}` });
  }
};

const deleteSavedItem = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await SavedList.deleteOne({ _id: id });
    res.json(result);
  } catch (err) {
    res.status(500).json({ err: `deleteSavedItem ${err}` });
  }
};

const deleteChecked = async (req, res) => {
  try {
    const result = await SavedList.deleteMany({ checked: true });
    res.json(result);
  } catch (err) {
    res.status(500).json({ err: `deleteChecked ${err}` });
  }
};

const deleteAllList = async (req, res) => {
  try {
    const result = await SavedList.deleteMany({});

    res.json(result);
  } catch (err) {
    res.status(500).json({ err: `deleteAllList ${err}` });
  }
};

module.exports = {
  findAll,
  getList,
  searchItem,
  searchItemOnList,
  addItemToList,
  checkedNotOnList,
  allNotOnList,
  itemAddedToList,
  updateList,
  deleteSavedItem,
  deleteChecked,
  deleteAllList,
};
