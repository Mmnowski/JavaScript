var mongoose = require('mongoose');

var ChatSchema = mongoose.Schema({
  users: {
    type: []
  },
  messages: {
    type: []
  },
  absentmessages: {
    type: []
  }
});

var Chat = module.exports = mongoose.model('Chat', ChatSchema);

module.exports.getById = (id, callback) => {
  Chat.findById(id, callback);
};