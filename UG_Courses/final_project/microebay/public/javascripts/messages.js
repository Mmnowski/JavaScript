$(document).ready(function () {
  let socket;
  let chatlist = $('#chat-list');
  let chatbox = $('#chatbox');
  let messageField = $('#text')
  var currentChat;
  let userID = $('#messages-panel').attr('data-id');

  socket = io.connect(`http://${location.host}/messages`);

  //sockets
  socket.on('loadChatlist', (data) => {
    let chatroom = document.createElement("div");
    chatroom.id = "chatroom";
    $(chatroom).data('id', data.id);
    chatroom.innerHTML = data.name;
    $(chatroom).addClass("chat-button");
    chatlist.append(chatroom);
  });

  socket.on('loadChatroom', (data) => {
    chatbox.empty();
    data.forEach(message => {
      let li = document.createElement('li');
      li.innerHTML = `${message}`;
      chatbox.append(li);
    });
  });

  socket.on('newMessage', (data) => {
    console.log(data);
    let li = document.createElement('li');
    li.innerHTML = `${data.text}`;
    chatbox.append(li);
  })

  $(window).on('load', () => {
  });

  $(window).on('unload', () => {
    socket.emit('disconnect');
  });

  $("#chat-list").on("click", "#chatroom", (e) => {
    var chatroomID = $(e.target).data('id');
    location.href = "/messages/" + chatroomID;
  })

  $("#load-messages").on("click", (e) => {
    var chatroomID = $(e.target).data('id');
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