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

router.get('/current/:id', ensureAuthenticated, function (req, res, next) {
  var bidable;
  var bid;
  if (req.user) {
    logged = true;
  }
  Auction.getById(req.params.id, function (err, auction) {
    if (err) {
      res.redirect("/profile/current");
    } else {
      if (auction) {
        if (auction.bidable === true) bidable = true;
        res.render('userAuction', { title: 'μBay', auction: auction, is_bidable: bidable, bid: bid});
      } else {
        res.redirect("/profile/current");
      }
    }
  });
});

router.post('/current/:id', ensureAuthenticated, function (req, res, next) {
  var logged;
  if (req.user) {
    logged = true;
  }
  Auction.getById(req.params.id, function (err, auction) {
    var bid = req.body.bid;
    if (bid && bid > auction.bid && req.user.id !== auction.owner) {
      if (bid > auction.buynowprice) {
        Auction.findByIdAndUpdate(req.params.id, { $set: { bid: bid, buynowprice: bid, highestbider: req.user.id }, $push: { allbiders: req.user.id } }, function (err, updatedauction) {
          if (err) {
            req.flash('error_msg', 'There was an error with your auction, please try again!');
            res.redirect('/profile/current');
          }
          res.redirect('/profile/current');
        });
      } else {
        Auction.findByIdAndUpdate(req.params.id, { $set: { bid: bid, highestbider: req.user.id }, $push: { allbiders: req.user.id } }, function (err, updatedauction) {
          if (err) {
            req.flash('error_msg', 'There was an error with your auction, please try again!');
            res.redirect('/profile/current');
          }
          res.redirect('/profile/current');
        });
      }
    } else if (!bid && req.user.id !== auction.owner) {
      Auction.findByIdAndUpdate(req.params.id, { $set: { bid: bid, highestbider: req.user.id, state: 'finished' }, $push: { allbiders: req.user.id } }, function (err, updatedauction) {
        if (err) {
          req.flash('error_msg', 'There was an error with your auction, please try again!');
          res.redirect('/profile/current');
        }
        res.redirect('/profile/current');
      });
    } else {
      req.flash('error_msg', 'You cant bid lower than the minimum bid');
      res.redirect('/profile/current');
    }
  });
});

router.get('/finished', ensureAuthenticated, function (req, res, next) {
  Auction.find({ highestbider: req.user.id, state: 'finished' }, function (err, user_auctions) {
    res.render('userAuctions', { title: 'Finished auctions - μBay', auction_list: user_auctions });
  });
});

module.exports = router;
