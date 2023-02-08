const {mongoose, Schema} = require('mongoose');

const categorySchema = new Schema({
   name:{
      type: String
   },
   items: {type: Array, ref: 'Grocerie'}
 })

const Category = mongoose.model('Category', categorySchema)
 module.exports = {Category};