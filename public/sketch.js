"use strict";

let Sound;
let Fonts;
let Images;

let user = localStorage.touchtypeUser;
if (!user)
	window.location.href = "./user.html";

let Keyboard = {
	KEY_A: 65,
	KEY_B: 66,
	KEY_C: 67,
	KEY_D: 68,
	KEY_E: 69,
	KEY_F: 70,
	KEY_G: 71,
	KEY_H: 72,
	KEY_I: 73,
	KEY_J: 74,
	KEY_K: 75,
	KEY_L: 76,
	KEY_M: 77,
	KEY_N: 78,
	KEY_O: 79,
	KEY_P: 80,
	KEY_Q: 81,
	KEY_R: 82,
	KEY_S: 83,
	KEY_T: 84,
	KEY_U: 85,
	KEY_V: 86,
	KEY_W: 87,
	KEY_X: 88,
	KEY_Y: 89,
	KEY_Z: 90,
	KEY_0: 48,
	KEY_1: 49,
	KEY_2: 50,
	KEY_3: 51,
	KEY_4: 52,
	KEY_5: 53,
	KEY_6: 54,
	KEY_7: 55,
	KEY_8: 56,
	KEY_9: 57,
	KEY_APOSTROPHE: 222,
	KEY_COMMA: 188,
	KEY_DASH: 189,
	KEY_PERIOD: 190,
	KEY_SEMICOLON: 186,
	KEY_SPACE : 32,
}

function Key(key, ch, x, y, w, finger) {
	this.key = key;
	this.ch = ch;
	this.x = x;
	this.y = y;
	this.w = w;
	this.finger = finger;
	Key.byKey[key] = this;
	Key.byChar[ch] = this;
}
Key.byKey = [];
Key.byChar = {};

const keys = [
	new Key(Keyboard.KEY_1, '1', -5, 2, 1, 1),
	new Key(Keyboard.KEY_2, '2', -4, 2, 1, 2),
	new Key(Keyboard.KEY_3, '3', -3, 2, 1, 3),
	new Key(Keyboard.KEY_4, '4', -2, 2, 1, 4),
	new Key(Keyboard.KEY_5, '5', -1, 2, 1, 4),
	new Key(Keyboard.KEY_6, '6', 0, 2, 1, 4),
	new Key(Keyboard.KEY_7, '7', 1, 2, 1, 5),
	new Key(Keyboard.KEY_8, '8', 2, 2, 1, 5),
	new Key(Keyboard.KEY_9, '9', 3, 2, 1, 6),
	new Key(Keyboard.KEY_0, '0', 4, 2, 1, 7),
	new Key(Keyboard.KEY_DASH, "-", 5, 2, 1, 8),

	new Key(Keyboard.KEY_A, 'a', -4.5, 0, 1, 1),
	new Key(Keyboard.KEY_S, 's', -3.5, 0, 1, 2),
	new Key(Keyboard.KEY_D, 'd', -2.5, 0, 1, 3),
	new Key(Keyboard.KEY_F, 'f', -1.5, 0, 1, 4),
	new Key(Keyboard.KEY_G, 'g', -0.5, 0, 1, 4),
	new Key(Keyboard.KEY_H, 'h', 0.5, 0, 1, 5),
	new Key(Keyboard.KEY_J, 'j', 1.5, 0, 1, 5),
	new Key(Keyboard.KEY_K, 'k', 2.5, 0, 1, 6),
	new Key(Keyboard.KEY_L, 'l', 3.5, 0, 1, 7),
	new Key(Keyboard.KEY_SEMICOLON, ';', 4.5, 0, 1, 8),
	new Key(Keyboard.KEY_APOSTROPHE, "'", 5.5, 0, 1, 8),

	new Key(Keyboard.KEY_Q, 'q', -4.8, 1, 1, 1),
	new Key(Keyboard.KEY_W, 'w', -3.8, 1, 1, 2),
	new Key(Keyboard.KEY_E, 'e', -2.8, 1, 1, 3),
	new Key(Keyboard.KEY_R, 'r', -1.8, 1, 1, 4),
	new Key(Keyboard.KEY_T, 't', -0.8, 1, 1, 4),
	new Key(Keyboard.KEY_Y, 'y', 0.2, 1, 1, 5),
	new Key(Keyboard.KEY_U, 'u', 1.2, 1, 1, 5),
	new Key(Keyboard.KEY_I, 'i', 2.2, 1, 1, 6),
	new Key(Keyboard.KEY_O, 'o', 3.2, 1, 1, 7),
	new Key(Keyboard.KEY_P, 'p', 4.2, 1, 1, 8),

	new Key(Keyboard.KEY_Z, 'z', -4, -1, 1, 2),
	new Key(Keyboard.KEY_X, 'x', -3, -1, 1, 3),
	new Key(Keyboard.KEY_C, 'c', -2, -1, 1, 4),
	new Key(Keyboard.KEY_V, 'v', -1, -1, 1, 4),
	new Key(Keyboard.KEY_B, 'b', 0, -1, 1, 4),
	new Key(Keyboard.KEY_N, 'n', 1, -1, 1, 5),
	new Key(Keyboard.KEY_M, 'm', 2, -1, 1, 5),
	new Key(Keyboard.KEY_COMMA, ',', 3, -1, 1, 6),
	new Key(Keyboard.KEY_PERIOD, '.', 4, -1, 1, 7),
	
	new Key(Keyboard.KEY_SPACE, ' ', 0, -2, 5, 0),
];

function preload() {
	Sound = {
		bell:  loadSound('assets/bell.mp3'),
		buzzer: loadSound('assets/buzzer.mp3'),
		click: loadSound('assets/click.mp3'),
		click2: loadSound('assets/click2.mp3'),
		success: loadSound('assets/success.mp3'),
	}
	Fonts = {
		game: loadFont("assets/comfortaa-regular.otf"),
		status: loadFont("assets/roboto-black.ttf"),
	}
	Images = {
		background: loadImage("assets/dark_spotlight.jpg"),
	}
}

function setup() {
	calcSizes();
	createCanvas(width, height);
}

window.onresize = function(e) {
	calcSizes();
	resizeCanvas(width, height);
}

let width;
let height;
// this is how far from the left margin we line up the current letter on
let cursorX;
let textY;
let textHeight;
let background;

function calcSizes() {
	width = window.innerWidth;
	height = window.innerHeight;
	let size = Math.min(width, height);
	cursorX = Math.ceil(width * 0.1);
	textHeight = Math.ceil(size * 0.1);
	textY = Math.ceil(height * 0.4 + textHeight * 0.5);
	background = createGraphics(width, height);
	background.image(Images.background, 0, 0, width, height);
}

let challenges;

function getChallengeText(level) {
	return levels[level]
}

let keyQueue = [];
// this remembers the current left-shiftedness of the challenge text in pixels
let textShiftLeftX = 0;

let gameState;

function setProgress(progress) {
	gameState.progress = progress;
	gameState.nextChar = gameState.challengeText[progress];
	gameState.nextKey = Key.byChar[gameState.nextChar.toLowerCase()];
	gameState.currentLetterStartTime = millis();
}

function resetProgress(noAttempt) {
	if (!noAttempt) {
		gameState.attempts++;
		saveProgress();
	}
	gameState.fail = false;
	gameState.levelStartTime = 0;
	setProgress(0);
}

function advanceProgress(time) {
	if (gameState.progress === 0)
		gameState.levelStartTime = millis();
	let nextProgress = gameState.progress + 1;
	if (nextProgress === gameState.challengeText.length) {
		if (gameState.fail) {
			resetProgress();
		}
		else {
			if (!gameState.myRecord || time < gameState.myRecord)
				gameState.myRecord = time;
			saveUserRecordTime(user, time);
			if (gameState.winTime < (millis() - gameState.levelStartTime))
				resetProgress();
			else
				advanceLevel(time);
		}
		return;
	}
	setProgress(nextProgress);
}

function saveUserRecordTime(forUser, time) {
	if (!forUser)
		forUser = user;
	const challenge = gameState.challengeText.toLowerCase();
	let data = {
		user: user,
		challenge: challenge,
		time: time,
	}
	console.log('saving time', data);
	apiPost('./api/save-time', data, () => {console.log('time saved')});
}

function getUserRecordTime(forUser, challengeText) {
	if (!forUser)
		forUser = user;
	let challenge = gameState.challengeText.toLowerCase();
	delete gameState.myRecord;
	console.log('getting record for', forUser);
	apiPost('./api/get-records', {user: forUser, challenge: challenge}, (err, responseText) => {
		let response = JSON.parse(responseText)
		let userRecord = response[forUser];
		console.log('record is', userRecord, response);
		if (userRecord && challenge == gameState.challengeText.toLowerCase()) {
			gameState.myRecord = userRecord;
		}
	})
}

function gotoLevel(level, attempts) {
	gameState.attempts = attempts || 0
	gameState.level = level;
	gameState.challengeText = getChallengeText(level);
	gameState.winTime = calcWinTime(gameState.challengeText);
		getUserRecordTime(user, gameState.challengeText);
	resetProgress(true);
}

function advanceLevel(time) {
	let nextLevel = gameState.level + 1;
	if (nextLevel >= levels.length) {
		gameState.rank++;
		nextLevel = ranks[gameState.rank].startLevel;
	}
	gotoLevel(nextLevel);
	saveProgress();
}

function failLevel() {
	if (!gameState.fail) {
		gameState.fail = true;
		saveProgress();
	}
}

let loadingState;
function initializeGameState() {
	loadingState = "loading";
	loadProgress(user, (err, saved) => {
		gameState = {}
		gameState.rank = saved.rank;
		gotoLevel(saved.level, saved.attempts);
		loadingState = "loaded";
	});
}

let badKey = false;
function draw() {
	//background(151);
	image(background, 0, 0, width, height);

	if (!loadingState) {
		initializeGameState();
		return;
	}
	if (loadingState === "loading") {
		return;
	}

	let timeNow = millis();
	let timeOnCurrentLetter = timeNow - gameState.currentLetterStartTime;
	let elapsedTime = timeNow - (gameState.levelStartTime || timeNow);
	let elapsedFraction = Math.min(1.0, elapsedTime / gameState.winTime);

	// process any keys
	if (keyQueue.length) {
		keyQueue.forEach(k => {
			let keyPressed = Key.byKey[k];
			badKey = false;
			if (keyPressed === gameState.nextKey) {
				// good job, play a click sound
				if (keyPressed == Key.byKey[Keyboard.KEY_SPACE]) {
					Sound.click2.play(null, null, 0.1);
				}
				else if (keyPressed) {
					Sound.click.play(null, null, 0.1);
				}
				let level = gameState.level;
				advanceProgress(elapsedTime);
				if (gameState.progress === 0) {
					if (gameState.level > level) 
						Sound.success.play(null, null, 0.1);
					else
						Sound.bell.play(null, null, 0.1);
				}
			}
			else if (k === 27) {
				resetProgress();
			}
			else if (keyPressed) {
				// whoops, buzzer
				badKey = k;
				Sound.buzzer.play(null, null, 0.1);
				if (gameState.progress)
					failLevel();
			}
		})
	}
	keyQueue = [];


	// split up the challenge text into the letter we expect next
	// and everything before it (finished)
	// and everything after it (remaining)
	let finishedText = gameState.challengeText.substring(0, gameState.progress);
	let remainText = gameState.challengeText.substring(gameState.progress + 1);

	// we'll set the text size and font now
	textSize(textHeight);
	textFont(Fonts.game);

	// get the width of each part so we can position it
	let nextCharWidth = lettersWidth(gameState.nextChar);
	let finishedTextWidth = lettersWidth(finishedText);
	let beginX = lettersWidth(gameState.challengeText[0]) * 0.5;
	let endX = lettersWidth(gameState.challengeText) - lettersWidth(gameState.challengeText.slice(-1)) * 0.5;

	// calculate how much of the text, in pixels, we've completed
	// we'll count the current character as half completed and so we'll use half its width
	// this way, if we shift the challenge text left by this many pixels
	// the center of the current character is always in the same place
	let actualProgressX = finishedTextWidth + (nextCharWidth * 0.5);
	// but the problem with that is that it makes it move jerkily
	// so we will animate it a bit
	// textShiftLeftX is the actual left-shiftedness of the challenge text
	// we will calculate how far it would have to move for it to be at our actual progress
	// but instead of moving it there immediately, we'll move it 7% of the way there (each frame)
	// this means that for large distances, it moves fast
	// but for small distances it moves slowly
	// and so as it gets closer (the distance grows smaller) it moves slower
	// This is called an "ease out" animation
	let difference = actualProgressX - textShiftLeftX;
	textShiftLeftX = textShiftLeftX + (difference * 0.1);

	// Now we draw the text
	noStroke();
	// We draw it in three parts so we can use three different colors
	fill(50, 50, 50);
	letters(finishedText, cursorX - textShiftLeftX, textY);

	fill(255, 0, 0);
	letters(gameState.nextChar, cursorX + finishedTextWidth - textShiftLeftX, textY);

	fill(230, 230, 230);
	letters(remainText, cursorX + finishedTextWidth + nextCharWidth - textShiftLeftX, textY);

	// show current position
	let cursorY = textY - textHeight - 18;
	noStroke();
	fill(255, 0, 0);
	ellipse(cursorX + finishedTextWidth - textShiftLeftX + (nextCharWidth * 0.5), cursorY, 13);
	if (gameState.fail)
		stroke(255, 0, 0);
	else
		stroke(255, 255, 255);
	strokeWeight(2);
	noFill();
	let progressPosition = finishedTextWidth + nextCharWidth * 0.5;
	ellipse(cursorX + progressPosition - textShiftLeftX, cursorY, 18);

	// show best pace position
	let paceY = textY + 10 + 18;
	let bestTime = gameState.myRecord;
	if (bestTime && !gameState.fail) {
		let bestFraction = Math.min(1.0, elapsedTime / bestTime);
		let bestPosition = beginX + bestFraction * (endX - beginX);
		stroke(120, 120, 120);
		noFill();
		ellipse(cursorX + bestPosition - textShiftLeftX, paceY, 15);
	}

	// show pace position
	if (!gameState.fail) {
		let pacePosition = beginX + elapsedFraction * (endX - beginX);
		stroke(255, 255, 0);
		noFill();
		ellipse(cursorX + pacePosition - textShiftLeftX, paceY, 15);
	}

	if (badKey) {
		drawKeyboard(1, gameState.nextKey, badKey);
	}
	else if (timeOnCurrentLetter > 2000) {
		// the user has been on this letter for a while,
		// so let's help him out by showing the keyboard

		// we'll fade the keyboard in over the course of a second
		let kbAlpha = 1 - Math.min(1000, 3000 - Math.min(timeOnCurrentLetter, 3000)) / 1000;
		drawKeyboard(kbAlpha, gameState.nextKey);
	}

	noStroke();
	textSize(18);
	textFont(Fonts.status);
	fill(100, 100, 100);
	text("Level", 120, 33);
	text("Attempts", 240, 33);
	text("Rank", 360, 33);
	
	stroke(0, 128, 0);
	strokeWeight(1);
	fill(0, 255, 0);
	textSize(24);
	text(gameState.level, 180, 35);
	text(gameState.attempts, 330, 35);
	text(ranks[gameState.rank].name, 420, 35);


	//text(finishedText, idealX - finishedTextWidth, 300);
	//text(remainText, idealX + nextCharWidth, 300);

	//show("elapsedFraction", elapsedFraction);
	//show("elapsedTime", elapsedTime);
	//show("winTime", gameState.winTime)
	showAll();
}

let fingerHomes = [
	{ x: 0, y: -2 }, // Thumb on Space
	{ x: -4.5, y: 0 }, // Left pinky on A
	{ x: -3.5, y: 0 }, // Left ring on S
	{ x: -2.5, y: 0 }, // Left middle on D
	{ x: -1.5, y: 0 }, // Left index on F
	{ x: 1.5, y: 0 }, // Right pinky on J
	{ x: 2.5, y: 0 }, // Right ring on K
	{ x: 3.5, y: 0 }, // Right middle on L
	{ x: 4.5, y: 0 }, // Right index on ;
]

// This function is responsible for drawing the keyboard on the screen
// when helping the user out
function drawKeyboard(alpha, hintKey) {
	let windowSize = Math.min(width, height);

	let kbcenter = { x: width / 2, y: height * 0.8 };
	let keyWidth = Math.floor(windowSize * 0.04);
	let keyHeight = Math.floor(windowSize * 0.04);
	let keyHorizPeriod = Math.ceil(windowSize * 0.045);
	let keyVertPeriod = -Math.ceil(windowSize * 0.045);

	noStroke();

	// draw every key
	keys.forEach(key => {
		let keyAlpha = keyIsDown(key.key) ? 1.0 : 0.2;
		strokeWeight(1)
		stroke(255, 255, 255, 100)
		fill(0, 77, 230, keyAlpha * alpha * 255);
		let x = kbcenter.x + key.x * keyHorizPeriod;
		let y = kbcenter.y + key.y * keyVertPeriod;
		let w = keyWidth * key.w;

		rect(x - w * 0.5, y - keyHeight * 0.5, w, keyHeight, 3);
	})

	for (let i = 0; i < 9; i++) {
		let h = fingerHomes[i];
		let hx = kbcenter.x + h.x * keyHorizPeriod;
		let hy = kbcenter.y + h.y * keyVertPeriod;
		if (hintKey.finger !== i) {
			fill(0, 0, 0, alpha * 255);
			ellipse(hx, hy, keyWidth - 5);
		}
		else {
			let fx = kbcenter.x + hintKey.x * keyHorizPeriod;
			let fy = kbcenter.y + hintKey.y * keyVertPeriod;
			if (hx !== fx || hy !== fy) {
				strokeWeight(3);
				stroke(255, 0, 0, alpha * 255);
				line(hx, hy, fx, fy);
				strokeWeight(0);
			}
			fill(255, 0, 0, alpha * 255);
			ellipse(fx, fy, keyWidth - 5);
		}
	}
}

// We use a special letters function instead of the built in text function
// this is necessary because text adjusts the spaces between different letters differently
// and we can't allow that because we'll draw the text using multiple calls (for multiple
// colors) and the spaces between letters would seem to change as we separate the text
// at different places
const spacing = 2;
function letters(s, x, y) {
	if (s === null || s === undefined || s === "")
		return 0
	let cx = x;
	// for each character in the string...
	for (let i = 0; i < s.length; i++) {
		let c = s[i];
		// draw the character
		text(c, cx, y);
		// calculate the character width (with spacing)
		let cw = textWidth(c) + spacing;
		// move the cursor by that much to prepare for the next character
		cx += cw;
	}
}

// we use a special letters width to measure the width of each letter individually
// to go along with our "letters" function which puts text on the screen one letter at a time
function lettersWidth(s) {
	if (s === null || s === undefined || s === "")
		return 0;
	let cx = 0;
	for (let i = 0; i < s.length; i++) {
		let c = s[i];
		let cw = textWidth(c) + spacing;
		cx += cw;
	}
	return cx;
}

function keyPressed() {
	keyQueue.push(keyCode);
}

function loadProgress(forUser, callback) {
	if (!forUser)
		forUser = user;
	apiPost('./api/load-progress', {user: forUser}, (err, response) => {
		let data = JSON.parse(response);
		let save = Object.assign({}, {
			level: 0,
			attempts: 0,
			rank: 0,
		}, data);
		callback(null, save);
	})
}

function saveProgress(forUser) {
	if (!forUser)
		forUser = user;
	let saveData = {
		user: forUser,
		level: gameState.level,
		attempts: gameState.attempts,
		rank: gameState.rank || 0,
	};
	console.log("saving...");
	gameState.saving = true;
	apiPost("./api/save-progress", saveData, () => {
		console.log("done");
		gameState.saving = false;
	})
}

function apiPost(path, data, callback) {
	var xhr = new XMLHttpRequest();
	xhr.open("POST", path, true);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	xhr.send(JSON.stringify(data));
	xhr.onloadend = function () {
		let response = xhr.responseText;
		callback(null, response);
	};
}

function calcWinTime(challengeText) {
	let words = challengeText.length * 0.2;
	let minutes = words / ranks[gameState.rank].wpm;
	let seconds = minutes * 60;
	let ms = seconds * 1000;
	return Math.ceil(ms);
}



// ---------------------------------------------------
// Show functions

let showVars = [];

function show(name, value) {
	showVars.push({name: name, value: value});
}

function showAll() {
	let widths = showVars.map(v => textWidth(v.name + ": "));
	let nameWidth = widths.reduce((a, v) => Math.max(a, v), 0);
	showVars.forEach((v, i) => {
		textSize(12);
		noStroke();
		fill(255, 255, 255, 200);
		const { name, value } = v;
		text(name + ": ", 4 + nameWidth - textWidth(name + ": "), 16 + 14 * i);
		text(value, 4 + nameWidth, 16 + 14 * i)
	})
	showVars = [];
}

const ranks = [
	{ name: "Student", wpm: 20, startLevel: 0 },
	{ name: "Apprentice", wpm: 40, startLevel: 195 },
	{ name: "Professional", wpm: 60, startLevel: 195 },
	{ name: "Master", wpm: 85, startLevel: 195 },
	{ name: "Grandmaster", wpm: 100, startLevel: 195 },
	{ name: "I am Legend", wpm: 200, startLevel: 195 },
]

const levels = [
	"a",
	"e",
	"a e",
	"e a",
	"a e a e",
	"i",
	"e i",
	"e i e i",
	"a e i a e i",
	"o",
	"o i",
	"o a",
	"o e o a o i",
	"u",
	"o u",
	"u a",
	"a u",
	"a u i o",
	"a e i o u",
	"u o i e a",
	"ea",
	"ea io",
	"ea io au",
	"ea io au eau",
	"ea io au eau ie",
	"ea io au eau ie ei",
	"ea io au eau ie ei",
	"ea io au eau ie ei oi",
	"io au eau ie ei oi ea",
	"au eau ie ei oi ea io",
	"eau ie ei oi ea io au",
	"ie ei oi ea io au eau",
	"ei oi ea io au eau ie",
	"oi ea io au eau ie ei",
	"ee io ie ei eau au ea",
	"ee oo io ei eau au ea",
	"ee oo ou ei io oi au",
	"ee oo ou ia io ea eau",
	"ee oo ou ia ai oi ea",
	"ee oo ou ia ai ui ui",
	"ui ee oo ou ia ai ui",
	"ai ui ia ou oo ee eau",
	"ea io au eau ie ei oi ee oo ou ia ai ui",
	"tea tio tau teau tie tei toi tee too tou tia tai tui",
	"eat iot aut eaut iet eit oit eet oot out iat ait uit",
	"at out it to oat out eat tee tea tout tie too tote toot tate otto iota auto tutti tutee tattoo",
	"nea nio nau neau nie nei noi nee noo nou nia nai nui",
	"ean ion aun eaun ien ein oin een oon oun ian ain uin",
	"un on no in an ton tan uno one nut nun not nit nan ion inn eon ant unto unit",
	"tune tuna toon tint tone tent teen tain onto noun note noon none nine neon",
	"neat into aunt unite union titan tenet taunt onion inane eaten atone attain notate",
	"intone uneaten nation annotate",
	"dea dio dau deau die dei doi dee doo dou dia dai dui",
	"ead iod aud eaud ied eid oid eed ood oud iad aid uid",
	"do tod tad nod end duo due dot doe die dan and ado toed",
	"idea node tied tide idea audit ditto donut tainted diet dote",
	"dine dent duet edit date",
	"fea fio fau feau fie fei foi fee foo fou fia fai fui",
	"eaf iof auf ief eif oif eef oof ouf iaf aif uif",
	"of if often fun fan fat fed fin find tofu font feud fend",
	"fund fade feed daft deaf unfed outfit fitted fondue",
	"infatuate defeat",
	"hea hio hau heau hie hei hoi hee hoo hou hia hai hui",
	"eah ioh auh eauh ieh eih oih eeh ooh ouh iah aih uih",
	"hi hot he haha uh huh hue hid hidden had hat ahah",
	"thin than thee thou thud then oath hone hate heed",
	"hunt hued heft haut head hand head hind haunted",
	"heated handout",
	"the",
	"the the the the",
	"the the the the the the the the the the",
	"of",
	"of of of of",
	"of of of of of of of of of of of",
	"of the of the of the of the of the",
	"and",
	"and and and",
	"and of the and of the and of the",
	"to",
	"to to to to to",
	"to the and the of the to the and the of the",
	"in",
	"in in in in in",
	"in the and the of the to the in the in the and the of the",
	"that",
	"that that that that that",
	"in that of that and that to that in and of that",
	"it and that of that and it to that and that and that",
	"he he he he he",
	"he and it of that of it in that of it and that",
	"on on on on on",
	"the on he the on he the on he the on he",
	"at at at at at",
	"and at that and at that and at that and at that",
	"one one one one",
	"one of it and one of that and he at that it in",
	"not not not not not",
	"not one of the one and one not of the one it not",
	"an an an an an an an",
	"an it and a that on that in the one in the one",
	"wa we wi wo wu",
	"as es is os us",
	"ra re ri ro ru",
	"was was was was",
	"for for for for",
	"was for was for was for",
	"are are are are",
	"as as as as",
	"are as for was are as for was",
	"with with with",
	"his his his",
	"for with his for with his",
	"ya ye yi yo yu",
	"they they they they",
	"ba be bi bo bu",
	"be be be be",
	"or or or or",
	"be this or that for he was not with the one",
	"ma me mi mo mu",
	"me me me me",
	"from from from from",
	"is not from me is not from me is not from me",
	"from me to you with love",
	"had had had",
	"has has has",
	"have have have have",
	"word word word",
	"has had his word has had his word",
	"have this from me",
	"by by by",
	"was this for me by the one",
	"but but but",
	"but not but not but not",
	"by the one that was not by me",
	"what what what what",
	"all all all all",
	"what all and all that what all and all that",
	"were were were",
	"we we we",
	"were we were we were we",
	"you your you your you your",
	"when you and the one had your word",
	"ca ce ci co cu",
	"can can can can can",
	"said said said said",
	"he said can you when the word is all",
	"there use was an each which she do",
	"was she in use when he was in",
	"each of their one was there which was in",
	"she and he do what they do when they can how they will",
	"up the other and about as many",
	"about as many the one and the other",
	"some here and some there",
	"for her and her are she and she",
	"these are for them they said",
	"so that is that",
	"so they are there",
	"so what so what",
	"so what about them",
	"why would some do so",
	"make him do it like this",
	"like him she does it",
	"look into time when all is over",
	"has to look two or more to see",
	"go write the number",
	"no way could people other than my first",
	"the water has been had by those who call its oil",
	"now find a long day when you come down",
	"did you get to come down",
	"may you part over the new sound and take only a little work",
	"know your place in the year that you live",
	"back to me give most after the thing",
	"very good very good",
	"this thing you call a sentence man",
	"think before you say great",
	"help through much before the line",
	"too right and too mean",
	"any old boy will tell the same old tale",
	"follow me for I want to show you around",
	"the form of three small people",
	"there must be a big well and another at the end",
	"because that is even",
	"because you turn here",
	"why ask why",
	"because that is how you learn",
	"men went and read about the need to have a different land",
	"a home for us will move",
	"try to be kind",
	"a hand on the picture again",
	"play off the change for a spell of air",
	"away the animal house points",
	"page after page of letters from mother",
	"answer the study he found still the world should work",
	"when I type this sentence in time I will be a master but if I keep going I will be a grand master",
	"from here on all the sentences will make sense and might make me a little bit smarter",
	"Less is more.",
	"No pain, no gain.",
	"Enough is enough.",
	"Haste makes waste.",
	"Love is blind.",
	"Talk is cheap.",
	"Boys will be boys.",
	"Easy come, easy go.",
	"Fight fire with fire.",
	"No man is an island.",
	"Waste not, want not.",
	"Better late than never.",
	"Let bygones be bygones.",
	"Tomorrow never comes.",
	"Do not rock the boat.",
	"Ignorance is bliss.",
	"It takes one to know one.",
	"It takes two to tango.",
	"All roads lead to Rome.",
	"Better safe than sorry.",
	"Big fish eat little fish.",
	"Cheaters never prosper.",
	"Crime does not pay.",
	"Do as I say, not as I do.",
	"Practice what you preach.",
	"Let sleeping dogs lie.",
	"Look before you leap.",
	"Count your blessings.",
	"History repeats itself.",
	"Practice makes perfect.",
	"A miss is as good as a mile.",
	"All is well that ends well.",
	"Home is where the heart is.",
	"Money isn't everything.",
	"No rest for the wicked.",
	"A stitch in time saves nine.",
	"Beggars cannot be choosers.",
	"Cold hands, warm heart.",
	"First come, first served.",
	"Great minds think alike.",
	"Like father, like son.",
	"A good man is hard to find.",
	"Another day, another dollar.",
	"Beauty is only skin deep.",
	"Honesty is the best policy.",
	"Life is what you make of it.",
	"Money doesn't grow on trees.",
	"Oil and water don't mix.",
	"Out of sight, out of mind.",
	"You are never too old to learn.",
	"A friend in need is a friend indeed.",
	"A penny saved is a penny earned.",
	"All is fair in love and war.",
	"Barking dogs seldom bite.",
	"Brevity is the soul of wit.",
	"Enough is as good as a feast.",
	"Small strokes fell great oaks.",
	"Time and tide wait for no man.",
	"A woman's work is never done.",
	"Feed a cold, starve a fever.",
	"Give credit where credit is due.",
	"In for a penny, in for a pound.",
	"Worrying never did anyone any good.",
	"Youth is wasted on the young.",
	"A dog is a man's best friend.",
	"A rising tide lifts all boats.",
	"A rolling stone gathers no moss.",
	"A soft answer turns away wrath.",
	"Blood is thicker than water.",
	"Failing to plan is planning to fail.",
	"Finders keepers, losers weepers.",
	"Flattery will get you nowhere.",
	"Penny wise and pound foolish.",
	"Rome wasn't built in a day.",
	"Truth is stranger than fiction.",
	"History is written by the winners.",
	"What goes up must come down.",
	"Where there's a will there's a way.",
	"A watched pot never boils.",
	"Beware of Greeks bearing gifts.",
	"Laughter is the best medicine.",
	"Many hands make light work.",
	"Opportunity never knocks twice.",
	"Don't switch horses midstream.",
	"Hindsight is always twenty-twenty.",
	"If it is not broken, do not fix it.",
	"The squeaky wheel gets the grease.",
	"Two wrongs don't make a right.",
	"A leopard cannot change its spots.",
	"A picture paints a thousand words.",
	"Birds of a feather flock together.",
	"Don't bite the hand that feeds you.",
	"Don't burn your bridges behind you.",
	"Don't put the cart before the horse.",
	"Don't bring a knife to a gunfight.",
	"Empty vessels make the most noise.",
	"Good fences make good neighbors.",
	"If anything can go wrong, it will.",
	"It is better to give than to receive.",
	"The early bird catches the worm.",
	"Necessity is the mother of invention.",
	"Too many cooks spoil the broth.",
	"What can't be cured must be endured.",
	"Actions speak louder than words.",
	"All good things must come to an end.",
	"First impressions are the most lasting.",
	"If you pay peanuts, you get monkeys.",
	"Many a true word is spoken in jest.",
	"Never judge a book by its cover.",
	"A fool and his money are soon parted.",
	"An apple a day keeps the doctor away.",
	"Beauty is in the eye of the beholder.",
	"The apple never falls far from the tree.",
	"When the cat's away the mice will play.",
	"When the going gets tough the tough get going.",
	"Absence makes the heart grow fonder.",
	"Don't cast your pearls before swine.",
	"Don't look a gift horse in the mouth.",
	"Don't put all your eggs in one basket.",
	"You must learn to crawl before you can walk.",
	"Fish and guests smell after three days.",
	"If life deals you lemons make lemonade.",
	"Nothing is certain but death and taxes.",
	"The bigger they are, the harder they fall.",
	"There's no such thing as a free lunch.",
	"A bird in the hand is worth two in the bush.",
	"A poor workman always blames his tools.",
	"Don't cut off your nose to spite your face.",
	"The love of money is the root of all evil.",
	"There's more than one way to skin a cat.",
	"Do not wash your dirty linen in public.",
	"Doubt is the beginning not the end of wisdom.",
	"Imitation is the sincerest form of flattery.",
	"You can't teach an old dog new tricks.",
	"A person is known by the company he keeps.",
	"Hell hath no fury like a woman scorned.",
	"There is no use crying over spilled milk.",
	"The hand that rocks the cradle rules the world.",
	"Two's company, three's a crowd.",
	"A chain is only as strong as its weakest link.",
	"All work and no play makes Jack a dull boy.",
	"Behind every great man there's a great woman.",
	"Do not cross the bridge until you come to it.",
	"He who lives by the sword shall die by the sword.",
	"Do unto others as you would have them do to you.",
	"If a job is worth doing it is worth doing well.",
	"An ounce of prevention is worth a pound of cure.",
	"Don't throw the baby out with the bath water.",
	"If you want something done well, you have to do it yourself.",
	"Lightning never strikes twice in the same place.",
	"That which does not kill us makes us stronger.",
	"The way to a man's heart is through his stomach.",
	"There are none so blind as those that will not see.",
	"A man who is his own lawyer has a fool for a client.",
	"Better to light a candle than to curse the darkness.",
	"Don't count your chickens before they are hatched.",
	"Give a man enough rope and he will hang himself.",
	"Work expands so as to fill the time available.",
	"A place for everything and everything in its place.",
	"Better to have loved and lost than never to have loved at all.",
	"If at first you don't succeed try, try again.",
	"In the kingdom of the blind the one eyed man is king.",
	"If you can't stand the heat, get out of the kitchen.",
	"Everyone wants to go to heaven but nobody wants to die.",
	"Never put off until tomorrow what you can do today.",
	"You catch more flies with honey than with vinegar.",
	"If you lie down with dogs, you will get up with fleas.",
	"No one can make you feel inferior without your consent.",
	"People who live in glass houses shouldn't throw stones.",
	"One half of the world does not know how the other half lives.",
	"The grass is always greener on the other side of the fence.",
	"Those who do not learn from history are doomed to repeat it.",
	"A journey of a thousand miles begins with a single step.",
	"Genius is one percent inspiration, ninety-nine percent perspiration.",
	"If at first you don't succeed, skydiving is not for you.",
	"You can lead a horse to water, but you can't make him drink.",
	"Early to bed and early to rise, makes a man healthy, wealthy and wise.",
	"There is no use locking the stable door after the horse has escaped.",
	"Better to remain silent and be thought a fool than to speak and remove all doubt.",
	"Give a man a fish and feed him for a day; teach him to fish and feed him for a lifetime.",
	"After typing this correctly, I will graduate to the next rank.",
]

