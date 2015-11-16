var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 		 = require('bcrypt-nodejs');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

// book schema 
var CommentSchema   = new Schema({
	comment: String,
	commentAuthor: {type: Schema.ObjectId, ref: 'User', },//required: true 
	bookId: {type: Schema.ObjectId, ref: 'Book', },//required: true 
	dateCreated: { type: Date, default: Date.now }
	
}).plugin(deepPopulate/*, options /* more on options below */);
;

module.exports = mongoose.model('Comment', CommentSchema);