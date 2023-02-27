 const {mongoose, Schema} = require('mongoose');

 const grocerieSchema = new Schema({
   name:{
      type: String
   },
   type:{
      type: String
   },
   icon:{
      type: String
   },
   onList: {
      type: Boolean
   }
 })


 const Grocerie = mongoose.model('Grocerie', grocerieSchema)
 module.exports = {Grocerie};