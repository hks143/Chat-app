
// const socket = io('http://localhost:8000', { transports: ['websocket', 'polling', 'flashsocket'] });
const socket=io();
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
// require("../db/cons");
// const Register=require('../models/register');
// import {userN} from '../index.js';
var audio = new Audio('notify.mp3');
var audio1 = new Audio('go.mp3');
var audio2 = new Audio('incoming.mp3');

const append = (message, position) => {
    const messageElement = document.createElement('div');
   
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);

    let d = new Date();
    let h = d.getHours();
    let m = d.getMinutes();

    let x = document.createElement('div');
    if (h >= 12) {
        h = h - 12;
        x.innerText = `${h}:${m}pm`;
    }
    else {

        x.innerText = `${h}:${m}am`;
    }
    x.classList.add('ti');
    x.classList.add(position);
    if (position != 'middle')
        messageContainer.append(x);

    if (position == 'right')
        audio1.play();
    else if (position == 'middle') {
        audio.play();
    }
    else {
        audio2.play();
    }
    messageContainer.scrollTop = messageContainer.scrollHeight;



}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    if (message != '') {

        append(`You : ${message} `, 'right');
        socket.emit('send', message);
        messageInput.value = '';

    }
    else {
        alert("Cannot send empty message!!");
    }
})

 var name = '';
do {
    name = prompt("Enter your username once again!!");

}
while (name == '')
socket.emit('new-user-joined', name);


socket.on('user-joined', name => {
    append(`${name} joined the chat,Welcome ${name}!!`, 'middle');

})



socket.on('receive', data => {
    append(`${data.name}: ${data.message}` , 'left');
})


socket.on('send', message => {
 
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });

})

socket.on('left', name => {
    append(`${name} left the chat,bye ${name} !!`, 'middle');

})

