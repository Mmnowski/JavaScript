var mongoose = require('mongoose');

var AuctionSchema = mongoose.Schema({
  name: {
    type: String
  },
  description: {
    type: String
  },
  bid: {
    type: Number
  },
  buynowprice: {
    type: Number
  },
  image: {
    type: String
  },
  owner: {
    type: String
  },
  highestbider: {
    type: String
  },
  allbiders: {
    type: Array
  },
  state: {
    type: String
  },
  length: {
    type: Number
  }
}, {timestamps: true});

var Auction = module.exports = mongoose.model('Auction', AuctionSchema);

module.exports.getById = (id, callback) => {
  Auction.findById(id, callback);
};

module.exports.getAllByOwner = (owner, callback) => {
  var query = { owner: owner };
  Auction.find(query, callback);
};

module.exports.getAllByBider = (bider, callback) => {
  var query = { allbiders: bider };
  Auction.find(query, callback);
};

module.exports.getAllByHighestBider = (bider, callback) => {
  var query = { highestbider: bider };
  Auction.find(query, callback);
};