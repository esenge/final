angular.module('bookService', [])

.factory('Book', function($http) {

	// create a new object
	var bookFactory = {};

	// get a single book
	bookFactory.get = function(id) {
		return $http.get('/api/books/' + id);
	};
	
	// get a single book by title
	bookFactory.getsinglebook = function(title) {
		return $http.get('/api/books/' + title);
	};

	// get all books
	bookFactory.all = function() {
		return $http.get('/api/books/');
	};

	// create a book
	bookFactory.create = function(bookData) {
		return $http.post('/api/books/', bookData);
	};

	// update a book
	bookFactory.update = function(id, bookData) {
		return $http.put('/api/books/' + id, bookData);
	};

	// delete a book
	bookFactory.delete = function(id) {
		return $http.delete('/api/books/' + id);
	};

	// return our entire bookFactory object
	return bookFactory;

});