var express = require('express')
var app = express()

app.get('/', function(req, res) {
	var user =  req.session.user;
	var	name = req.session.name;

	console.log('Name: '+name);
	if(name == null) {
	  	res.redirect("/user/login");
	  	return;
	}

	res.render('index', {title: 'ToDo List', name: name})
})

module.exports = app;