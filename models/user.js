var mongoose = require('mongoose');

//Genre Schema
var userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    facebookId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    genre: {
        type: String,
        required: false
    }, picture: {
        type: String,
        required: false
    },
    create_date: {
        type: Date,
        default: Date.now
    }
});

var User = module.exports = mongoose.model('User', userSchema);

//Get users
module.exports.getUsers = function(callback, limit) {
    User.find(callback).limit(limit);
}

// Add User
module.exports.addUser = function(user, callback) {
    User.create(user, callback);
}

// Update User
module.exports.updateUser = function(id, user, options, callback) {
    var query = {_id: id};
    var update = {
        name: user.name
    }
    User.findOneAndUpdate(query, update, options, callback);
};

// Find User by email
module.exports.getUserByEmail = function(email, callback) {
    var query = {email: email};
    User.findOne(query, callback);
}

module.exports.getUserByFacebookId = function(facebookId, callback) {
    console.log(facebookId)
    var query = {facebookId: facebookId};
    User.findOne(query, callback);
};

module.exports.createUser = function(user, callback) {
    User.create(user, callback);
}