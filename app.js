const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let users = [];
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
	socket.on('user login', function(user) {
		socket.username = user;
		users.push(socket.username);
		io.emit('user login', { users: users });
	});

	socket.on('disconnect', function() {
		users.splice(users.indexOf(socket), 1);
	});

	socket.on('chat message', function(msg) {
		io.emit('chat message', { msg: msg, user: socket.username });
	});
});

http.listen('3000', function() {
	console.log('Running on port 3000...');
});
