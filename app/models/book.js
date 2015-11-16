var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 		 = require('bcrypt-nodejs');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

// book schema 
var BookSchema   = new Schema({
	title: { type: String, required: true},
	author: {type: Schema.ObjectId, ref: 'Author'},
	user: {type: Schema.ObjectId, ref: 'User', required: true },
	comments: [{type: Schema.ObjectId, ref: 'Comment'}]
}).plugin(deepPopulate/*, options /* more on options below */);;

module.exports = mongoose.model('Book', BookSchema);