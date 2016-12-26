"use strict"
const path = require('path');
const Datastore = require('nedb');
const sha1 = require('sha1');

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
		// first get this user's record (if any)
		db.findOne(
			{ forUser: user, challenge: challenge },
			(err, doc) => {
				let response = {}
				if (doc)
					response[user] = doc.time;
				// then find the all time record
				db.find({challenge: challenge}).sort({time: 1}).limit(1).exec((err, docs) => {
					if (docs && docs.length)
						response.record = {time: docs[0].time, user: docs[0].forUser};
					res.send(JSON.stringify(response));
					res.end();
				})
			}
		)
	},
	'/check-login': (req, res) => {
		const { username, password } = req.body;
		db.findOne({ username }, (err, doc) => {
			if (!doc) {
				res.send(JSON.stringify({status: "confirm", username: username}));
			}
			else {
				let hash = sha1(password + '|' + username);
				if (hash === doc.hash)
					res.send(JSON.stringify({status: "success", username: username}));
				else
					res.send(JSON.stringify({status: "badpw", username: username}))
			}
			res.end();
		})
	},
	'/create-user': (req, res) => {
		const { username, password } = req.body;
		let hash = sha1(password + '|' + username);
		db.insert({username: username, hash: hash}, (err, doc) => {
			if (!err) {
				res.send(JSON.stringify({status: "success", username: username}));			
			}
			else {
				res.send(JSON.stringify({status: "error", error: err}));
			}
			res.end();
		});
	}
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