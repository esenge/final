angular.module('bookCtrl', ['bookService'])

.controller('bookController', function(Book) {

	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;

	// grab all the books at page load
	Book.all()
		.success(function(data) {

			// when all the books come back, remove the processing variable
			vm.processing = false;

			// bind the books that come back to vm.books
			vm.books = data;
		});

	// function to delete a book
	vm.deleteBook = function(id) {
		vm.processing = true;

		Book.delete(id)
			.success(function(data) {

				// get all books to update the table
				// you can also set up your api 
				// to return the list of books with the delete call
				Book.all()
					.success(function(data) {
						vm.processing = false;
						vm.books = data;
					});

			});
	};

})

// controller applied to book creation page
.controller('bookCreateController', function(Book, Auth) {

	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'create';

	// function to create a book
	vm.saveBook = function() {
		vm.processing = true;
		vm.message = '';


		Auth.getUser()
			.then(function(data) {
				data.data;
				vm.bookData.user_id = data.data.id;

				Book.create(vm.bookData)
					.success(function(data) {
						vm.processing = false;
						vm.bookData = {};
						vm.message = data.message;
					});
			});
	};

})

// controller applied to book edit page
.controller('bookEditController', function($routeParams, Book) {

	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'edit';

	// get the book data for the book you want to edit
	// $routeParams is the way we grab data from the URL
	Book.get($routeParams.book_id)
		.success(function(data) {
			vm.bookData = data;
		});

	// function to save the book
	vm.saveBook = function(id) {
		vm.processing = true;
		vm.message = '';

		// call the bookService function to update 
		Book.update($routeParams.book_id, vm.bookData)
			.success(function(data) {
				vm.processing = false;

				// clear the form
				vm.bookData = {};

				// bind the message from our API to vm.message
				vm.message = data.message;
			});
	};

});