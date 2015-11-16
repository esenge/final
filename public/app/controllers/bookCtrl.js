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
			console.log(data);
		});
	console.log("BLABLABLAL11111111111");
	

	// function to delete a book
	vm.deleteBook = function(id) {
		vm.processing = true;
		console.log("BLABLABLAL2222222222");
		console.log(id);
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

.controller('myBookController', function(Book, Auth) {

	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;

	Auth.getUser()
		.then(function(data) {

			Book.allMy(data.data.id)
				.success(function(data) {

					// when all the books come back, remove the processing variable
					vm.processing = false;

					// bind the books that come back to vm.books
					vm.books = data;
				});
		});

	// function to delete a book
	vm.deleteBook = function(id) {
		vm.processing = true;
		Book.delete(id)
			.success(function(data) {

				// get all books to update the table
				// you can also set up your api 
				// to return the list of books with the delete call
				Auth.getUser()
					.then(function(data) {

						Book.allMy(data.data.id)
							.success(function(data) {

								// when all the books come back, remove the processing variable
								vm.processing = false;

								// bind the books that come back to vm.books
								vm.books = data;
							});
					});
			});
	};
})

// controller applied to book creation page
.controller('bookCreateController', function(Book, Auth, $location) {

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

				//getAuthor to check if same

				Book.create(vm.bookData)
					.success(function(data) {
						console.log(data);
						vm.processing = false;
						vm.bookData = {};
						vm.message = data.message;
						$location.path('/books');
					});
			});

	};

})

// controller applied to book edit page
.controller('bookEditController', function($routeParams, Book, $location) {

	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'edit';

	// get the book data for the book you want to edit
	// $routeParams is the way we grab data from the URL

	Book.get($routeParams.book_id)
		.success(function(data) {
			vm.bookData = data;
			console.log($routeParams.book_id);
			console.log(data);
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
				$location.path('/books');
			});
	};

})

.controller('bookSingleController', function($routeParams, $scope, Book, Auth) {

	var vm = this;

	vm.type = 'getSingleBook';
	console.log($routeParams.book_id);

	Book.getSingleBook($routeParams.book_id)
		.success(function(data) {
			vm.bookData = data;
			console.log(vm.bookData);
			console.log(vm.bookData.comments[0].commentAuthor.username);
			console.log(vm.bookData.comments.comment.commentAuthor.name);
		});



	//maybe need to wait a bit before loads bookdata, to get id from it!!!!
	$scope.date = new Date();


	vm.saveComment = function() {
		//console.log(vm.bookData);
		vm.processing = true;
		vm.message = '';

		vm.commentData.date = $scope.date;
		vm.commentData.bookId = vm.bookData._id; //get bookID


		//finder user, to get userID
		Auth.getUser()
			.then(function(data) {

				console.log(data.data.id);

				vm.commentData.commentAuthor = data.data.id;

				console.log(vm.commentData.commentAuthor);

				Book.addComment(vm.commentData)
					.success(function(data) {
						vm.processing = false;
						vm.commentData = {};
						vm.message = data.message;
					

						Book.getSingleBook($routeParams.book_id)
							.success(function(data) {
								vm.bookData = data;
								
							});

					});
			});

	};

})


.controller('bookSingleAuthorController', function($routeParams, $scope, Book) {

	var vm = this;

	vm.type = 'getSingleBook';
	console.log($routeParams.author_id);


	Book.allAuthorBooks($routeParams.author_id)
		.success(function(data) {

			// when all the books come back, remove the processing variable
			vm.processing = false;

			// bind the books that come back to vm.books
			vm.books = data;
			console.log(data);
		});


})

