var mongoose = require('mongoose');

//Genre Schema

var productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  reference:{
    type: String,
    required: true
  },
  haulPrice:{
    type: String,
    required: true
  },
  sellPrice:{
    type: String,
    required: true
  },
  color:{
    type: String,
    required: false
  },
  photos:{
    type: Array,
    required: false
  },
  create_date:{
    type: Date,
    default: Date.now
  }
});

var Product = module.exports = mongoose.model('Product', productSchema);

module.exports.createProduct = function(product, callback){
  Product.create(product, callback);
}

//Get Products
module.exports.getProducts = function(callback, limit){
  Product.find(callback).limit(limit);
}

// Update Genre
module.exports.updateProduct = function(id, product, options, callback){
  var query = {_id: id};
  var update = product
  Product.findOneAndUpdate(query, product, options, callback);
}

module.exports.getProductById = function(id, callback){
  Product.findById(id, callback);
}
