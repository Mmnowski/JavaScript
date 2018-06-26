var express = require('express');
var router = express.Router();
var Auction = require('../models/auction')

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  else
    res.redirect('/users/login')
};

/* GET home page. */
router.get('/', ensureAuthenticated, function (req, res, next) {
  res.render('profile', { title: req.user.name + '\'s profile', username: req.user.username });
});

router.get('/owner', ensureAuthenticated, function (req, res, next) {
  Auction.getAllByOwner(req.user.id, function (err, user_auctions) {
    res.render('userAuctions', { title: 'Your auctions - μBay', auction_list: user_auctions });
  });
});

router.get('/current', ensureAuthenticated, function (req, res, next) {
  Auction.find({ allbiders: { $in: [req.user.id] }, state: 'ongoing' }, function (err, user_auctions) {
    res.render('userAuctions', { title: 'Current auctions - μBay', auction_list: user_auctions });
  });
});

router.get('/finished', ensureAuthenticated, function (req, res, next) {
  Auction.find({ highestbider: req.user.id, state: 'finished' }, function (err, user_auctions) {
    res.render('userAuctions', { title: 'Finished auctions - μBay', auction_list: user_auctions });
  });
});

module.exports = router;
