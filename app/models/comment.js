var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;
var bcrypt 		 = require('bcrypt-nodejs');

// book schema 
var CommentSchema   = new Schema({
	comment: String,
	commentauthor: {type: Schema.ObjectId, ref: 'UserSchema', required: true },
	bookId: {type: Schema.ObjectId, ref: 'BookSchema', required: true },
	dateCreated: { type: Date, default: Date.now }
	
});

module.exports = mongoose.model('Comment', CommentSchema);