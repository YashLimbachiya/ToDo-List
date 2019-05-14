var express = require('express')
var app = express()

app.get('/', function(req, res, next) {
	res.render('templates/signup', {title: 'ToDo List'});
})

app.post('/', function(req, res, next) {
	req.getConnection(function(error, conn) {
		message = '';
		if(req.method == "POST") {
			var post  = req.body;
			var name= post.user_name;
			var pass= post.password;
			var fname= post.first_name;
			var lname= post.last_name;
			var mob= post.mob_no;

			var sql = "INSERT INTO `users`(`first_name`,`last_name`,`mob_no`,`user_name`, `password`) VALUES ('" + fname + "','" + lname + "','" + mob + "','" + name + "','" + pass + "')";

			var query = conn.query(sql, function(err, result) {
				message = "Succesfully! Your account has been created.";
				res.render('signup.ejs',{message: message});
			});

		} else {
			res.render('signup');
		}
	})
})

module.exports = app