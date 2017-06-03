var mongoose = require('mongoose');

//Genre Schema
var bookSchema = mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  genre:{
    type: String,
    required: true
  },
  description:{
    type: String,
    required: false
  },
  create_date:{
    type: Date,
    default: Date.now
  }
});

var Book = module.exports = mongoose.model('Book', bookSchema);

//Get Books
module.exports.getBooks = function(callback, limit){
  Book.find(callback).limit(limit);
}

module.exports.getBookById = function(id, callback){
  Book.findById(id, callback);
}
