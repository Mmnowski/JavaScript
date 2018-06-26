var express = require('express');
var router = express.Router();
var Chat = require('../models/chat')
var User = require('../models/user')

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
};

const userlist = []
const absentmessages = []
var connectionID;

module.exports = (io) => {
  router.get('/', ensureAuthenticated, (req, res) => {
    res.render('messages', { title: 'Messages', user_id: req.user.id });
  });

  router.get('/:id', ensureAuthenticated, function (req, res, next) {
    User.getById(req.params.id, function (err, user) {
      if (!user) {
        res.redirect('/messages')
      } else {
        Chat.findOne({ users: { $all: [req.user.id, req.params.id] } }, function (err, chatroom) {
          if (err) {
            res.redirect('/messages')
          } else {
            if (chatroom) {
              chatroom.users = [req.user.id, req.params.id];
            } else {

              var newChat = new Chat({
                users: [req.user.id, req.params.id],
                messages: [],
                absentmessages: []
              });

              newChat.save((err, chat) => {
                if (err) {
                  req.flash('error_msg', 'There was an error, please try again!');
                  res.redirect('/messages');
                }
                res.render('messages', { title: 'Messages', chatroom: req.params.id, user_id: req.user.id });
              });
            }
            res.render('messages', { title: 'Messages', chatroom: req.params.id, user_id: req.user.id });
          }
        });
      }
    });
  });

  //sockets
  io.of('/messages').on('connect', (socket) => {
    //check if user is logged in
    let index = userlist.findIndex(e => e.user === socket.request.user);
    if (index === -1) userlist.push(socket.request.user.id);

    console.log(socket.request.user)

    Chat.find({ users: { $in: [socket.request.user.id] } }, function (err, chatlist) {
      let temp = chatlist[0].users.indexOf(socket.request.user.id);
      chatlist[0].users.splice(temp, 1);
      var recieverID = chatlist[0].users
      User.getById(recieverID[0], function (err, user) {
        socket.emit('loadChatlist', { name: user.username, id: recieverID[0] });
      });
    });

    socket.on('joinChatroom', data => {
      socket.join(data.own_id);
      Chat.findOne({ users: { $all: [data.own_id, data.connect_id] } }, function (err, chatlist) {
        io.of('/messages').to(data.own_id).emit('loadChatroom', chatlist.messages);
      });
    })

    socket.on('sendMessage', data => {
      let checkConnected = userlist.findIndex(e => e.user === data.to);
      console.log('====================================');
      console.log(data);
      console.log('====================================');
      console.log(checkConnected);
      if (checkConnected === -1) {
        Chat.findOneAndUpdate({ users: { $all: [data.message.user, data.to] } }, { $push: { messages: data.message.text } }, function (err, chatlist) {
        });
      } else {
        Chat.findOneAndUpdate({ users: { $all: [data.message.user, data.to] } }, { $push: { messages: data.message.text } }, function (err, chatlist) {
        });
      }
      io.of('/messages').to(data.message.user).emit('newMessage', data.message);
      io.of('/messages').to(data.to).emit('newMessage', data.message);
    })

    socket.on('disconnect', () => {
      let index = userlist.indexOf(socket);
      userlist.splice(index, 1);
    });

  });

  return router;
};