var express = require('express')
var app = express()

app.get('/', function(req, res) {
	var user =  req.session.user;
	var	name = req.session.name;
	var	username = req.session.username;

	console.log('Name: '+name);
	if(name == null) {
	  	res.redirect("/user/login");
	  	return;
	}

	res.render('index', {title: 'ToDo List', name: name, site: 2})
})

module.exports = app;