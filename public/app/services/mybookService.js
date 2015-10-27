angular.module('mybookService', [])

.factory('Mybook', function($http) {

	// create a new object
	var mybookFactory = {};

	// get a single mybook
	mybookFactory.get = function(id) {
		return $http.get('/api/mybooks/' + id);
	};

	// get all mybooks
	mybookFactory.all = function() {
		return $http.get('/api/mybooks/');
	};

	// create a book
	mybookFactory.create = function(mybookData) {
		return $http.post('/api/mybooks/', mybookData);
	};

	// update a book
	mybookFactory.update = function(id, mybookData) {
		return $http.put('/api/mybooks/' + id, mybookData);
	};

	// delete a book
	mybookFactory.delete = function(id) {
		return $http.delete('/api/mybooks/' + id);
	};

	// return our entire mybookFactory object
	return mybookFactory;

});