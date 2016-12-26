"use strict"
const path = require('path');
const Datastore = require('nedb');

let db;

const api = {
	'/save-progress': (req, res) => {
		const { user, level, rank, attempts } = req.body;
		if (!user)
			throw "user is required";
		const update = {
			$set: {
				user: user,
				attempts: attempts,
			},
			$max: {
				level: level,
				rank: rank,
			},
		};
		db.update(
			{ user: user },
			update,
			{ upsert: true },
			(err, numAffected, affectedDocuments, upsert) => {
				console.log("update", update);
				res.send(JSON.stringify({numAffected}));
				res.end();
			}
		);
	},
	'/load-progress': (req, res) => {
		const { user } = req.body;
		db.findOne({ user: user }, (err, doc) => {
			res.send(JSON.stringify(doc));
			res.end();
		});
	},
	'/save-time': (req, res) => {
		console.log("save time...");
		const { user, challenge, time } = req.body;
		db.update(
			{ forUser: user, challenge: challenge },
			{ $min: { time: time }, $set: { forUser: user, challenge: challenge } },
			{ upsert: true },
			(err, numAffected, affectedDocuments, upsert) => {
				console.log("save time", affectedDocuments);
				res.send(JSON.stringify({numAffected}));
				res.end();
			}
		)
	},
	'/get-records': (req, res) => {
		const { user, challenge } = req.body;
		db.findOne(
			{ forUser: user, challenge: challenge },
			(err, doc) => {
				if (doc)
					res.send(JSON.stringify({[user]: doc.time}));
				else
					res.send("{}");
				res.end();
			}
		)
	},
}

module.exports = function({express, app}) {
	db = new Datastore({
		filename: path.join(__dirname, 'jstouchtype.db'),
		timestampData: true,
		autoload: true,
	})

	db.loadDatabase((err) => {
		console.log("Database load:", err);
	})

	app.use('/jstouchtype/api', function(req, res, next) {
		const handler = api[req.path];
		if (!handler)
			next();
		try {
			handler(req, res, next);
		}
		catch (e) {
			console.error(e);
			res.send(JSON.stringify(e));
			res.end();
		}
	})

	app.use('/jstouchtype/', express.static(path.join(__dirname, 'public')));
}