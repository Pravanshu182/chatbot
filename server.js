const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const PORT = 4040;

// Serve static files from the "public" folder
app.use(express.static('public'));

// Routes for sender and receiver
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));
app.get('/receiver', (req, res) => res.sendFile(__dirname + '/public/receiver.html'));

// In-memory store for connected users
const users = {};

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('user-connected', username => {
    users[socket.id] = username;
    socket.broadcast.emit('user-status', { user: username, status: 'online' });
  });

  socket.on('chat message', (msgData) => {
    msgData.seen = false;
    io.emit('chat message', { ...msgData });
  });

  socket.on('message seen', (msgData) => {
    io.emit('message seen', msgData); // Broadcast message seen event
  });

  socket.on('disconnect', () => {
    const user = users[socket.id];
    socket.broadcast.emit('user-status', { user, status: 'offline' });
    delete users[socket.id];
    console.log('User disconnected');
  });
});

// Start server on all network interfaces so it's accessible from other devices
http.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});
