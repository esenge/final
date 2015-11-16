var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

// Auhtor schema 
var AuthorSchema   = new Schema({
	name: { type: String, required: true},
	book: [{type: Schema.ObjectId, ref: 'BookSchema'}],//parmainit uz array
});


module.exports = mongoose.model('Author', AuthorSchema);