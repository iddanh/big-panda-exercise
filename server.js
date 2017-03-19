"use strict";
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var logger = require('morgan');
var http = require('http');
var mongoose = require('mongoose');
var BPromise = require('bluebird');
mongoose.Promise = BPromise;

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost/big-panda');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
	console.log("Connected to db");
});

var messageSchema = mongoose.Schema({
	email: String,
	message: String
});

var Message = mongoose.model('Message', messageSchema);

app.get('/messages', function (req, res, next) {

	Message.find()
		.then(function (messages) {

			res.json(messages);

		})
		.catch(next);

});

app.post('/messages', function (req, res, next) {

	var message = new Message({email: req.body.email, message: req.body.message});

	message.save()
		.then(function () {

			res.json({success: true});

		})
		.catch(next);

});

//Catch all routes
app.get('*', function (req, res) {
	res.sendFile(path.join(__dirname, 'public/index.html'));
});


app.use(function (err, req, res, next) {
	console.log(err);
	res.status(err.status || 500);
	res.json({
		message: err.message,
		error: err
	});
});

//Set up server
var port = process.env.PORT || 3001;
app.set('port', port);

var server = http.createServer(app);
server.listen(port);
console.log('Listening on port: ' + port + '...');

module.exports = app;
