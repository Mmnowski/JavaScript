//jshint browser: true, esversion: 6, globalstrict: true, devel: true
/* global io: false */
'use strict';

// Inicjalizacja UI
document.onreadystatechange = () => {
    if (document.readyState === "interactive") {
        let status = document.getElementById('status');
        let open = document.getElementById('open');
        let close = document.getElementById('close');
        let send = document.getElementById('send');
        let text = document.getElementById('text');
        let message = document.getElementById('message');
        let textbox = document.getElementById('textbox');
        let nickname = document.getElementById('nickname');
        let userlist = document.getElementById('users');
        let roomlist = document.getElementById('roomlist');
        let add = document.getElementById('addroom');
        let rooms = document.querySelectorAll('room');
        let username;
        let roomname;
        let timestamp;
        let socket;
        let ping;

        Date.prototype.timeNow = function () {
            return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
        }

        status.textContent = 'Brak połącznia';
        close.disabled = true;
        send.disabled = true;

        // Po kliknięciu guzika „Połącz” tworzymy nowe połączenie WS
        open.addEventListener('click', () => {

            socket = io.connect(`http://${location.host}/main`);

            socket.on('connect', () => {
                username = prompt("Please enter your username");
                if (username) {
                    socket.emit('tryuser', username);
                }
            });
            socket.on('usernameAccepted', () => {
                socket.emit('user', username);
                socket.emit('heartbeat', username);
                open.disabled = true;
                close.disabled = false;
                send.disabled = false;
                status.src = 'img/bullet_green.png';
                console.log('Nawiązano połączenie przez Socket.io');
            });
            socket.on('usernameDenied', () => {
                username = prompt("Username taken. Please reenter your username");
                if (username) {
                    socket.emit('tryuser', username);
                }
            });
            socket.on('userlist', (data) => {
                if (data === '') {
                    while (userlist.firstChild) {
                        userlist.removeChild(userlist.firstChild);
                    }
                } else {
                    let div = document.createElement('div');
                    div.innerHTML = `<p>${data}</p>`;
                    userlist.appendChild(div);
                }
            });
            socket.on('roomCreated', (data) => {
                while (textbox.firstChild) {
                    textbox.removeChild(textbox.firstChild);
                }
                let div = document.createElement('div');
                div.id = 'room';
                div.innerText = `${data}`;
                div.addEventListener
                roomlist.appendChild(div);
            });
            socket.on('roomExists', () => {
                roomname = prompt("Room with that name exists. Please rename your room and try again:");
                if (roomname) {
                    socket.emit('tryroom', roomname);
                }
            })
            socket.on('disconnect', () => {
                open.disabled = false;
                while (textbox.firstChild) {
                    textbox.removeChild(textbox.firstChild);
                }
                status.src = 'img/bullet_red.png';
                console.log('Połączenie przez Socket.io zostało zakończone');
            });
            ping = setInterval(function () {
                socket.emit('heartbeat');
                console.log('ping');
            }, 5000);
            socket.on('error', (err) => {
                message.textContent = `Błąd połączenia z serwerem: "${JSON.stringify(err)}"`;
            });
            socket.on('message', (data) => {
                let li = document.createElement('li');
                li.innerHTML = `${data.hour} ${data.user} : ${data.text}`;
                textbox.appendChild(li);
            });
        });

        roomlist.addEventListener('click', (e) => {
            console.log(e.target);
            socket.emit('joinroom', e.target.textContent);
        });

        add.addEventListener('click', () => {
            roomname = prompt("Please enter your rooms name:");
            if (roomname) {
                socket.emit('tryroom', roomname);
            }
        });

        // Zamknij połączenie po kliknięciu guzika „Rozłącz”
        close.addEventListener('click', () => {
            close.disabled = true;
            send.disabled = true;
            message.textContent = '';
            socket.emit('removeuser', username);
            clearInterval(ping);
            while (userlist.firstChild) {
                userlist.removeChild(userlist.firstChild);
            }
            socket.disconnect();
        });

        // Wyślij komunikat do serwera po naciśnięciu guzika „Wyślij”
        send.addEventListener('click', () => {
            if (text.value) {
                timestamp = new Date().timeNow() + " -";
                let message = { hour: timestamp, user: username, text: text.value }
                socket.emit('message', message);
                console.log(`Wysłałem wiadomość: „${text.value}”`);
                text.value = '';
            }
        });

        text.addEventListener("keydown", (e) => {
            if (e.key === 'Enter') {
                if (text.value) {
                    timestamp = new Date().timeNow() + " -";
                    let message = { hour: timestamp, user: username, text: text.value }
                    socket.emit('message', message);
                    console.log(`Wysłałem wiadomość: „${text.value}”`);
                    text.value = '';
                }
            }
        });
    }
};