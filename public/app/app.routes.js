angular.module('app.routes', ['ngRoute'])

	.config(function($routeProvider, $locationProvider) {

	$routeProvider

	// route for the home page
		.when('/', {
		templateUrl : 'app/views/pages/home.html'
	})

	// login page
		.when('/login', {
		templateUrl : 'app/views/pages/login.html',
		controller  : 'mainController',
		controllerAs: 'login'
	})

	// show all users
		.when('/users', {
		templateUrl: 'app/views/pages/users/all.html',
		controller: 'userController',
		controllerAs: 'user'
	})

	// form to create a new user
	// same view as edit page
		.when('/users/create', {
		templateUrl: 'app/views/pages/users/single.html',
		controller: 'userCreateController',
		controllerAs: 'user'
	})

	// page to edit a user
		.when('/users/:user_id', {
		templateUrl: 'app/views/pages/users/single.html',
		controller: 'userEditController',
		controllerAs: 'user'
	})
	
	/*=============BOOOKS=====================================*/
	
	// show books
		.when('/books', {
		templateUrl: 'app/views/pages/books/all.html',
		controller: 'bookController',
		controllerAs: 'book'
	})

	// form to create a new book
	// same view as edit page
		.when('/books/create', {
		templateUrl: 'app/views/pages/books/single.html',
		controller: 'bookCreateController',
		controllerAs: 'book'
	})

	// page to edit a book
		.when('/books/:book_id', {
		templateUrl: 'app/views/pages/books/single.html',
		controller: 'bookEditController',
		controllerAs: 'book'
	})
	
	// == MY BOOKS ==//
	.when('/mybooks', {
		templateUrl: 'app/views/pages/mybooks/all.html',
		controller: 'myBookController',
		controllerAs: 'book'
	});
	
	
	
	
	$locationProvider.html5Mode(true);

});