const axios = require('axios');
const { Category } = require("../models/category");
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
    await axios.patch('')
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
  getList,
  searchItemOnList,
  checkedNotOnList,
  allNotOnList,
  updateList,
  deleteSavedItem,
  deleteChecked,
  deleteAllList,
};
