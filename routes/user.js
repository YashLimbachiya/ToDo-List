var express = require('express')
var app = express()

app.use(express.static('public'))

app.get('/signup', function(req, res, next) {
	message = '';
	res.render('templates/signup', {title: 'ToDo List', message: message, site: 0});
})

app.post('/signup', function(req, res, next) {
	req.getConnection(function(error, conn) {
		message = '';
		var post  = req.body;
		var name = post.name;
		var usrname = post.usrname;
		var pwd = post.pwd;

		var sql = "INSERT INTO user (name, username, password) VALUES ?";

		var values = [
			[name, usrname, pwd]
		];

		var query = conn.query(sql, [values], function(err, result) {
			message = "Succesfully! Your account has been created.";
			res.render('templates/signup', {title: 'ToDo List', message: message, site: 0});
		});
	})
})

app.get('/login', function(req, res, next) {
	message = '';
	res.render('templates/login', {title: 'ToDo List', message: message, site: 1});
})

app.post('/login', function(req, res, next) {
	req.getConnection(function(error, conn) {
		var message = '';
		var sess = req.session; 

		var post  = req.body;
		var usrname = post.usrname;
		var pwd = post.pwd;

		var sql = "SELECT * FROM user WHERE username = ? AND password = ?";

		conn.query(sql, [usrname, pwd], function(err, results){      
			if(results.length == 1) {
				req.session.name = results[0].name;
				req.session.username = results[0].username;				
				req.session.user = results[0];
				console.log(results[0].name);

				username = results[0].username;
				var sql_create = "CREATE TABLE IF NOT EXISTS "+ username +" (id INT(5) NOT NULL AUTO_INCREMENT, item VARCHAR(50) NOT NULL, PRIMARY KEY(id))";
				conn.query(sql_create, function (err, results, fields) {
					if (err) throw err;
					console.log("Item table of "+username+" created");
					res.redirect("/");
				});
			}
			else {
				message = 'Wrong Credentials.';
				res.render('templates/login', {title: 'ToDo List', message: message, site: 1});
			}
		})
	})
})

app.get('/logout', function(req, res, next) {
	req.session.destroy(function(err) {
		res.redirect('login');
	})
})

module.exports = app