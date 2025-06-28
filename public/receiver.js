const socket = io();
const form = document.getElementById('chatForm');
const input = document.getElementById('msgInput');
const messages = document.getElementById('messages');

const username = prompt("Enter your name (Receiver)");
document.getElementById('header').innerText = `👤 ${username}`;
socket.emit('user-connected', username);

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    const msgData = {
      user: username,
      message: input.value,
      time: new Date().toLocaleTimeString()
    };
    socket.emit('chat message', msgData);
    input.value = '';
  }
});

socket.on('chat message', (msgData) => {
  const item = document.createElement('li');
  item.innerHTML = `<strong>${msgData.user}</strong> <small>[${msgData.time}]</small><br>${msgData.message}`;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;

  
  setTimeout(() => {
    socket.emit('message seen', msgData);
  }, 1000);
});

socket.on('user-status', ({ user, status }) => {
  alert(`${user} is now ${status}`);
});
