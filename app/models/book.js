var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 		 = require('bcrypt-nodejs');

// book schema 
var BookSchema   = new Schema({
	title: { type: String, required: true},
	author: { type: String, required: true },
	user: {type: Schema.ObjectId, ref: 'UserSchema', required: true },
});

module.exports = mongoose.model('Book', BookSchema);