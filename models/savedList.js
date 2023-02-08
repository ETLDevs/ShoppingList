const {mongoose, Schema} = require('mongoose');

const savedListSchema = new Schema({
 item: {
  type: mongoose.Schema.Types.ObjectId, ref: 'Grocerie'
 },
  quantity:{ 
    type: Number
  },
  comments:{
    type: String
  },
  checked: {
    type: Boolean
  }
})


const SavedList = mongoose.model('SavedList', savedListSchema)
module.exports = {SavedList};