const { Category } = require("../models/category");
const { Grocerie } = require("../models/grocerie");
const { SavedList } = require("../models/savedList");

const findAll = async (req, res) => {
  try {
    const categories = await Category.find().populate("items");
    res.render("index", { categories });
  } catch (err) {}
};

const getList = async (req, res) => {
  try {
    const savedList = await SavedList.find().populate("item");
    res.render("list", { savedList });
  } catch (err) {
    console.log(`getList ERROR ${err}`);
  }
};

const searchItem = async (req, res) => {
const name = req.params.name;
try {
const foundItems = await Grocerie.find({name: {$regex : new RegExp(`^${name}`), "$options": "i"}}).limit(5);
res.json(foundItems)
} catch (err) {
  console.log(`searchItem ERROR ${err}`);
}
};

const searchItemOnList = async (req, res) => {
const name = req.params.name;
try {
const savedList = await SavedList.find().populate({
path: 'item',
match: {name: {$regex : new RegExp(`^${name}`), "$options": "i"}}});
const html = await res.render('list', { savedList });
    res.send(html);
} catch (err) {
  console.log(`searchItem ERROR ${err}`);
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
    res.json({ status: "Success", redirect: "/" });
  } catch (err) {
    console.log(`addItemToList ERROR ${err}`);
  }
};

const checkedNotOnList = async (req, res) => {
  try{
    const groceries = await SavedList.find({checked: true}).populate('item');
    console.log(groceries)
    let deleted;
    groceries.forEach( async item => {
    deleted = await Grocerie.updateOne({name:item.item.name}, {$set:{onList:false}});  
  })
res.json(deleted);
} catch (err) {
  console.log(`checkedNotOnList ERROR ${err}`);
}
}

const allNotOnList = async (req, res) => {
  try{
    const groceries = await SavedList.find({}).populate('item');
const deleted = await Grocerie.updateMany({groceries}, {onList:false});
res.json(deleted);
} catch (err) {
  console.log(`checkedNotOnList ERROR ${err}`);
} 
}

const itemAddedToList = async (req, res) => {
  const _id = req.params.id;
  let result;
  try{
  const item = await Grocerie.findById(_id);
  result = await Grocerie.updateOne({_id}, {$set: {onList:!item.onList}})
res.json(result)
}
catch (err) {
  console.log(`itemAddedToList ERROR ${err}`);
}
}

const updateList = async (req, res) => {
  const id = req.params.id;
  try {
   const update = await SavedList.findOneAndUpdate({ _id: id }, req.body);
    console.log("UPDATED");
    res.json(update); 
  } catch (err) {
    console.log(`updateList ERROR ${err}`);
  }
};

const deleteSavedItem = async (req, res) => {
  const id = req.params.id;
  try {   
    const result = await SavedList.deleteOne({ _id: id });
    res.json(result);
  } catch (err) {
    res.json(err);
  }
};

const deleteChecked = async (req, res) => {
  try {
    const result = await SavedList.deleteMany({ checked: true });
    res.json(result);
  } catch (err) {
    console.log(`deleteChecks Error ${err}`)
    res.json(err);
  }
}

const deleteAllList = async (req, res) => {
  try {
    const result = await SavedList.deleteMany({});
    
    res.json(result);
  } catch (err) {
    console.log(err)
    res.json(err);
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
