angular.module('bookService', [])

.factory('Book', function($http) {

	// create a new object
	var bookFactory = {};

	// get a single book
	bookFactory.get = function(id) {
		return $http.get('/api/books/' + id);
	};
	
	// get book single page
	bookFactory.getSingleBook = function(id) {
		return $http.get('/api/books/bookinfo/'+id);
	};

	// get all books
	bookFactory.all = function() {
		return $http.get('/api/books/');
	};
	
	// get all my books
	bookFactory.allMy = function(id) {
		return $http.get('/api/mybooks/'+id);
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