angular.module('mybookCtrl', ['mybookService'])

.controller('mybookController', function(Mybook) {

	var vm = this;

	// set a processing variable to show loading things
	vm.processing = true;

	// grab all the mybooks at page load
	Mybook.all()
		.success(function(data) {

			// when all the mybooks come back, remove the processing variable
			vm.processing = false;

			// bind the mybooks that come back to vm.mybooks
			vm.mybooks = data;
		});

	// function to delete a mybook
	vm.deleteMybook = function(id) {
		vm.processing = true;

		Mybook.delete(id)
			.success(function(data) {

				// get all mybooks to update the table
				// you can also set up your api 
				// to return the list of mybooks with the delete call
				Mybook.all()
					.success(function(data) {
						vm.processing = false;
						vm.mybooks = data;
					});

			});
	};

})

// controller applied to mybook creation page
.controller('mybookCreateController', function(Mybook) {
	
	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'create';

	// function to create a mybook
	vm.saveMybook = function() {
		vm.processing = true;
		vm.message = '';

		// use the create function in the mybookService
		Mybook.create(vm.mybookData)
			.success(function(data) {
				vm.processing = false;
				vm.mybookData = {};
				vm.message = data.message;
			});
			
	};	

})

// controller applied to mybook edit page
.controller('mybookEditController', function($routeParams, Mybook) {

	var vm = this;

	// variable to hide/show elements of the view
	// differentiates between create or edit pages
	vm.type = 'edit';

	// get the mybook data for the mybook you want to edit
	// $routeParams is the way we grab data from the URL
	Mybook.get($routeParams.mybook_id)
		.success(function(data) {
			vm.mybookData = data;
		});

	// function to save the mybook
	vm.saveMybook = function() {
		vm.processing = true;
		vm.message = '';

		// call the mybookService function to update 
		Mybook.update($routeParams.mybook_id_id, vm.mybookDataData)
			.success(function(data) {
				vm.processing = false;

				// clear the form
				vm.mybookDataData = {};

				// bind the message from our API to vm.message
				vm.message = data.message;
			});
	};

});