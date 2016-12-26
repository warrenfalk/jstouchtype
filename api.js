"use strict"
const path = require('path');

module.exports = function({express, app}) {
	app.use('/jstouchtype/api', function(req, res) {
		res.send('got here');
		res.end();
	})

	app.use('/jstouchtype/', express.static(path.join(__dirname, 'public')));
}