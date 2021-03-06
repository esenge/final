var bodyParser = require('body-parser'); // get body-parser
var User = require('../models/user');
var Book = require('../models/book');
var Author = require('../models/author');
var Comment = require('../models/comment');
var jwt = require('jsonwebtoken');
var config = require('../../config');


// super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express) {

	var apiRouter = express.Router();


	apiRouter.route('/users')
		.post(function(req, res) {
			// var objektaID;
			var user = new User(); // create a new instance of the User model
			user.name = req.body.name; // set the users name (comes from the request)
			user.username = req.body.username; // set the users username (comes from the request)
			user.password = req.body.password; // set the users password (comes from the request)

			user.save(function(err, username) {

				// objektaID = username.id;
				//user.save(function(err) {
				if (err) {
					// duplicate entry
					if (err.code == 11000)
						return res.json({
							success: false,
							message: 'A user with that username already exists. '
						});
					else
						return res.send(err);
				}

				// return a message
				res.json({
					message: 'User creat`ed!'
				});
			});

		})
		//get all the users (accessed at GET http://localhost:8080/api/users)
		.get(function(req, res) {

			User.find({}, function(err, users) {
				if (err) res.send(err);

				// return the users
				res.json(users);
			});
		});

	// route to authenticate a user (POST http://localhost:8080/api/authenticate)
	apiRouter.post('/authenticate', function(req, res) {

		// find the user
		User.findOne({
			username: req.body.username
		}).select('name username password').exec(function(err, user) {

			if (err) throw err;

			// no user with that username was found
			if (!user) {
				res.json({
					success: false,
					message: 'Authentication failed. User not found.'
				});
			}
			else if (user) {

				// check if password matches
				var validPassword = user.comparePassword(req.body.password);
				if (!validPassword) {
					res.json({
						success: false,
						message: 'Authentication failed. Wrong password.'
					});
				}
				else {

					// if user is found and password is right
					// create a token
					var token = jwt.sign({
						id: user._id, //saglabā esošo user id
						name: user.name,
						username: user.username
					}, superSecret, {
						expiresInMinutes: 1400 // expires in 24 hours
					});

					var lietotajs = user._id;
					console.log(lietotajs);

					// return the information including token as JSON
					res.json({
						success: true,
						message: 'Enjoy your token!',
						token: token,
						id: user._id
					});
				}

			}

		});
	});

	// route middleware to verify a token
	apiRouter.use(function(req, res, next) {
		// do logging
		console.log('Somebody just came to our app!');

		// check header or url parameters or post parameters for token
		var token = req.body.token || req.query.token || req.headers['x-access-token'];

		// decode token
		if (token) {

			// verifies secret and checks exp
			jwt.verify(token, superSecret, function(err, decoded) {

				if (err) {
					res.status(403).send({
						success: false,
						message: 'Failed to authenticate token.'
					});
				}
				else {
					// if everything is good, save to request for use in other routes
					req.decoded = decoded;

					next(); // make sure we go to the next routes and don't stop here
				}
			});

		}
		else {

			// if there is no token
			// return an HTTP response of 403 (access forbidden) and an error message
			res.status(403).send({
				success: false,
				message: 'No token provided.'
			});

		}
	});

	// test route to make sure everything is working 
	// accessed at GET http://localhost:8080/api
	apiRouter.get('/', function(req, res) {
		res.json({
			message: 'hooray! welcome to our api!'
		});
	});

	// // on routes that end in /users
	// // ----------------------------------------------------
	// apiRouter.route('/users')

	// //create a user (accessed at POST http://localhost:8080/users)
	// 		.post(function(req, res) {

	// 			console.log("DEBUGTHIS!!!!!!!!")
	// 			console.log(res.body);

	// 		var objektaID;
	// 		var user = new User();		// create a new instance of the User model
	// 		user.name = req.body.name;  // set the users name (comes from the request)
	// 		user.username = req.body.username;  // set the users username (comes from the request)
	// 		user.password = req.body.password;  // set the users password (comes from the request)

	// 		user.save(function(err, username) {

	// 			objektaID = username.id;
	// 			//user.save(function(err) {
	// 			if (err) {
	// 				// duplicate entry
	// 				if (err.code == 11000) 
	// 					return res.json({ success: false, message: 'A user with that username already exists. '});
	// 				else 
	// 					return res.send(err);
	// 			}

	// 			// return a message
	// 			res.json({ message: 'User created!' });
	// 		});

	// 	})

	// // get all the users (accessed at GET http://localhost:8080/api/users)
	// .get(function(req, res) {

	// 	User.find({}, function(err, users) {
	// 		if (err) res.send(err);

	// 		// return the users
	// 		res.json(users);
	// 	});
	// });

	// on routes that end in /users/:user_id
	// ----------------------------------------------------
	apiRouter.route('/users/:user_id')

	// get the user with that id
	.get(function(req, res) {
		User.findById(req.params.user_id, function(err, user) {
			if (err) res.send(err);

			// return that user
			res.json(user);
		});
	})

	// update the user with this id
	.put(function(req, res) {
		User.findById(req.params.user_id, function(err, user) {

			if (err) res.send(err);

			// set the new user information if it exists in the request
			if (req.body.name) user.name = req.body.name;
			if (req.body.username) user.username = req.body.username;
			if (req.body.password) user.password = req.body.password;

			// save the user
			user.save(function(err) {
				if (err) res.send(err);

				// return a message
				res.json({
					message: 'User updated!'
				});
			});

		});
	})

	// delete the user with this id
	.delete(function(req, res) {
		User.remove({
			_id: req.params.user_id
		}, function(err, user) {
			if (err) res.send(err);

			res.json({
				message: 'Successfully deleted'
			});
		});
	});

	/*----------------------------------*/
	/*----------------------------------*/
	/*----------------------------------*/
	/*----------------------------------*/
	/*----------------------------------*/
	/*----------------------------------*/

	// on routes that end in /books
	// ----------------------------------------------------
	apiRouter.route('/books')
		// create a user (accessed at POST http://localhost:8080/users)
		.post(function(req, res) {

			console.log(req.body);
			var book = new Book(); // create a new instance of the User model

			book.title = req.body.title; // set the users username (comes from the request)
			book.user = req.body.user_id;

			//getAuthor to check if same
			//find author, if null then new Author();

			Author.findOne({
					name: req.body.author.name
				},
				function(err, author) {

					if (err) res.send(err);

					if (author === null) {
						var author = new Author();
						author.name = req.body.author.name;
						author.book = book._id;
					}

					book.author = author._id;
					author.book.push(book._id);

					author.save(function(err) {
						if (err) {
							// duplicate entry
							if (err.code == 11000)
								return res.json({
									success: false,
									message: 'An author with that username already exists. '
								});
							else
								return res.send(err);
						}

						book.save(function(err, books) {
							if (err) {
								// duplicate entry
								if (err.code == 11000)
									return res.json({
										success: false,
										message: 'A book with that name already exists. '
									});
								else
									return res.send(err);


							}
							res.json({
								message: 'book created and author created'
							});
						});

					});

				});

		})

	// get all the users (accessed at GET http://localhost:8080/api/users)
	.get(function(req, res) {
		//console.log(req.protocol + '://' + req.get('host') + req.originalUrl);
		Book.find().populate("author").exec(function(error, books) {
			res.json(books);
		})

		// Book.find({}, function(err, books) {
		// 	if (err) res.send(err);

		// 	// return the users
		// 	res.json(books);
		// });
	});

	// on routes that end in /books/:book_id
	// ----------------------------------------------------
	apiRouter.route('/books/:book_id')

	//get the book with that id
	.get(function(req, res) {
			Book.findById(req.params.book_id).populate("author").exec(function(err, book) {
				console.log(book);
				res.json(book);
			});


		})
		// update the book with this id
		.put(function(req, res) {
			Book.findById(req.params.book_id, function(err, book) {

				if (err) res.send(err);
				if (req.body.title) book.title = req.body.title;

				// save the book
				book.save(function(err) {
					if (err) res.send(err);

					Author.findById(
						book.author,
						function(err, author) {

							if (err) res.send(err);

							if (req.body.author) author.name = req.body.author.name;
							author.save(function(err) {
								if (err) {
									// duplicate entry
									if (err.code == 11000)
										return res.json({
											success: false,
											message: 'An author with that username already exists. '
										});
									else
										return res.send(err);
								}

							});
						}
					);
					// return a message
					res.json({
						message: 'book and author updated!'
					});
				});

			});
		})

	// delete the book with this id
	.delete(function(req, res) {
		Book.remove({
			_id: req.params.book_id
		}, function(err, book) {
			if (err) res.send(err);

			console.log(req.params.book_id);

			//remove books comments
			Comment.remove({
				bookId: req.params.book_id
			}, function(err, book) {
				if (err) res.send(err);

				console.log(req.params.book_id);

				res.json({
					message: 'Comment and book successfully deleted'
				});
			});


		});
	});


	// on routes that end in /books/:user_id
	// ----------------------------------------------------
	apiRouter.route('/mybooks/:user_id')

	//get all the users (accessed at GET http://localhost:8080/api/users)
	.get(function(req, res) {

		Book.find({
			"user": req.params.user_id
		}).populate("author").exec(function(error, books) {
			res.json(books);
		});


	});

	// on routes that end in /books/bookinfo/:book_id
	// ----------------------------------------------------
	apiRouter.route('/books/bookinfo/:book_id')

	.get(function(req, res) {

		Book.findById(req.params.book_id).populate('comments').populate("user").populate("author").deepPopulate('comments.commentAuthor') //use deepPopulate to populate lower levels
			.exec(function(error, book) {
				console.log(JSON.stringify(book, null, "\t"))
				Book.populate
				res.json(book);
			})
	});





	// on routes that end in /books/bookinfo
	// ----------------------------------------------------
	apiRouter.route('/books/bookinfo')
		// create a user (accessed at POST http://localhost:8080/users)
		.post(function(req, res) {

			var comment = new Comment(); // create a new instance of the User model
			//user.name = req.body.name;  // set the users name (comes from the request)
			console.log("STUFF");
			console.log(req.body);
			comment.comment = req.body.comment; // set the users username (comes from the request)
			comment.dateCreated = req.body.date; // 
			comment.bookId = req.body.bookId;
			comment.commentAuthor = req.body.commentAuthor; // set the users password (comes from the request)
			// book.user = req.body.user_id;
			//console.log(req.body.bookId);
			Book.findById(req.body.bookId, function(err, book) {
				if (err) res.send(err); -

				book.comments.push(comment._id);
				///book.save
				book.save(function(err) {
					if (err)
						res.send(err);

					//res.json(book);//if multiple response, server fail
				});

			});


			comment.save(function(err) {
				if (err) {
					// duplicate entry
					if (err.code == 11000)
						return res.json({
							success: false,
							message: 'A comment with that username already exists. '
						});
					else
						return res.send(err);
				}


				// return a message
				res.json({
					message: 'comment created!'
				});
			});


		})

	// on routes that end in /books/bookauthors/:user_id
	// ----------------------------------------------------
	apiRouter.route('/books/bookauthors/:author_id')

	//get all the users (accessed at GET http://localhost:8080/api/users)
	.get(function(req, res) {

		Book.find({
			"author": req.params.author_id
		}).populate("author").exec(function(error, books) {

			res.json(books);
		});

	});

	// on routes that end in /books/bookauthors/:user_id
	// ----------------------------------------------------
	apiRouter.route('/users/usersinfo/:user_id')

	//get all the users (accessed at GET http://localhost:8080/api/users)
	.get(function(req, res) {

		Book.find({
				"user": req.params.user_id
			}).populate("user").populate("author")
			.exec(function(error, books) {

				res.json(books);
			});

	});


	// api endpoint to get user information
	apiRouter.get('/me', function(req, res) {
		res.send(req.decoded);
	});

	return apiRouter;
};