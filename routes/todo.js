var express = require('express')
var app = express()

// SHOW LIST OF Tasks
app.get('/', function(req, res, next) {
	var user =  req.session.user;
	var	username = req.session.username;

   console.log('ddd='+username);
   if(username == null){
      res.redirect("/user/login");
      return;
   }

	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM tasks ORDER BY id ASC',function(err, rows, fields) {
			if (err) {
				req.flash('error', err)
				res.render('templates/list', {
					title: 'ToDo List', 
					data: ''
				})
			} else {
				res.render('templates/list', {
					title: 'ToDo List', 
					data: rows
				})
			}
		})
	})
})

// SHOW ADD USER FORM
app.get('/add', function(req, res, next){	
	res.render('templates/add', {
		title: 'Add New Task',
		item: ''
	})
})

// ADD NEW USER POST ACTION
app.post('/add', function(req, res, next){	
	req.assert('item', 'Item is required').notEmpty()
	
    var errors = req.validationErrors()
    
    if( !errors ) {
		var items = {
			item: req.sanitize('item').escape().trim(),
		}
		
		req.getConnection(function(error, conn) {
			conn.query('INSERT INTO tasks SET ?', items, function(err, result) {
				if (err) {
					req.flash('error', err)
					res.render('templates/add', {
						title: 'Add New Task',
						item: items.item,
					})
				} else {				
					req.flash('success', 'Data added successfully!')
					res.render('templates/add', {
						title: 'Add New Task',
						item: '',
					})
				}
			})
		})
	}
	else {
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})				
		req.flash('error', error_msg)		
        res.render('templates/add', { 
            title: 'Add New Task',
            item: req.body.item,
        })
    }
})

// SHOW EDIT Task FORM
app.get('/edit/(:id)', function(req, res, next){
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM tasks WHERE id = ?', [req.params.id], function(err, rows, fields) {
			if(err) throw err
			
			// if task not found
			if (rows.length <= 0) {
				req.flash('error', 'Task not found with id = ' + req.params.id)
				res.redirect('/todo')
			}
			else {
				res.render('templates/edit', {
					title: 'Edit Task', 
					//data: rows[0],
					id: rows[0].id,
					item: rows[0].item,
				})
			}			
		})
	})
})

// EDIT USER POST ACTION
app.put('/edit/(:id)', function(req, res, next) {
	req.assert('item', 'Item is required').notEmpty()
	
    var errors = req.validationErrors()
    
    if( !errors ) {
		var items = {
			item: req.sanitize('item').escape().trim(),
		}
		
		req.getConnection(function(error, conn) {
			conn.query('UPDATE tasks SET ? WHERE id = ' + req.params.id, items, function(err, result) {
				if (err) {
					req.flash('error', err)
					res.render('templates/edit', {
						title: 'Edit Task',
						id: req.params.id,
						item: req.body.item,
					})
				} else {
					req.flash('success', 'Task updated successfully!')
					res.render('templates/edit', {
						title: 'Edit Task',
						id: req.params.id,
						item: req.body.item,
					})
				}
			})
		})
	} else {
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)
		
        res.render('templates/edit', { 
            title: 'Edit Task',            
			id: req.params.id, 
			item: req.body.item,
		})
    }
})

// DELETE USER
app.delete('/delete/(:id)', function(req, res, next) {
	var item = { id: req.params.id }
	
	req.getConnection(function(error, conn) {
		conn.query('DELETE FROM tasks WHERE id = ' + req.params.id, item, function(err, result) {
			if (err) {
				req.flash('error', err)
				res.redirect('/todo')
			} else {
				req.flash('success', 'Task deleted successfully! id = ' + req.params.id)
				res.redirect('/todo')
			}
		})
	})
})

module.exports = app