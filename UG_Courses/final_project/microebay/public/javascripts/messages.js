$(document).ready(function () {
  let socket;
  let chatlist = $('#chat-list');
  let chatbox = $('#chatbox');
  let send = $('#send');
  let messageField = $('#text')
  let messagesRow = $('#messagesRow');
  let newMessageButton = $('#newMessage');
  let sendMessage = $('#sendMessage');
  let chat = [];
  var currentChat;
  let userID = $('#messages-panel').attr('data-id');

  socket = io.connect(`http://${location.host}/messages`);

  //sockets
  socket.on('loadChatlist', (data) => {
    let chatroom = document.createElement("div");
    chatroom.id = "chatroom";
    $(chatroom).data('id', data);
    chatroom.innerHTML = data;
    $(chatroom).addClass("chat-button");
    chatlist.append(chatroom);
  });

  socket.on('loadChatroom', (data) => {
    console.log(data);
    console.log('Hello!');
    data.forEach(message => {
      let li = document.createElement('li');
      li.innerHTML = `${message.text}`;
      chatbox.appendChild(li);
    });
  });

  socket.on('newMessage', (data) => {
    console.log('hello');
    let li = document.createElement('li');
    li.innerHTML = `${data.text}`;
    chatbox.appendChild(li);
  })

  $(window).on('load', () => {
  });

  $(window).on('unload', () => {
    socket.emit('disconnect');
  });

  $("#chat-list").on("click", "#chatroom", (e) => {
    var chatroomID = $(e.target).data('id');
    location.href = "/messages/" + chatroomID;
    socket.emit('joinChatroom', { own_id: userID, connect_id: chatroomID });
  })

  $("#send").on("click", (e) => {
    if (messageField.val()) {
      let message = { user: userID, text: messageField.val() }
      currentChat = $(e.target).data('id');
      socket.emit('sendMessage', { message: message, to: currentChat });
      text.value = '';
    }
  })

  messageField.on('keydown', (e) => {
    if (e.which === 13) {
      if (messageField.val()) {
        let message = { user: userID, text: messageField.val() }
        currentChat = $(e.target).data('id');
        socket.emit('sendMessage', { message: message, to: currentChat });
        text.value = '';
      }
    }
  });
})