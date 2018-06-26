var express = require('express');
var router = express.Router();
var Auction = require('../models/auction')

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  else
    res.redirect('/users/login')
};

function update(auct) {
  Auction.getById(auct.id, function (err, auction) {
    Auction.findByIdAndUpdate(auct.id, { $set: { state: 'finished' } }, function (err, updatedauction) {
      if (err) {
        req.flash('error_msg', 'There was an error with an alert for your auction, sorry!');
      }
    });
  });
}
module.exports = (io) => {
  router.get('/', function (req, res, next) {
    var logged;
    if (req.user) {
      logged = true;
    }
    Auction.find({ 'state': 'ongoing' }, function (err, auctions) {
      res.render('auctions', { title: 'Auctions - μBay', auction_list: auctions, is_logged: logged });
    })
  });

  router.get('/add', ensureAuthenticated, function (req, res, next) {
    res.render('addAuction', { title: 'Add an auction' });
  });

  router.post('/add', function (req, res, next) {
    var name = req.body.name;
    var description = req.body.description;
    var bid = req.body.bid;
    var buynowprice = req.body.buynow;
    var length = req.body.length;
    var start = req.body.start;
    var duration;
    var buyable;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('description', 'Surname is required').notEmpty();
    req.checkBody('bid', 'Wrong min. bid format').isDecimal({ decimal_digits: '2' });
    req.checkBody('length', 'Please pick a valid length').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
      res.render('addAuction', { title: 'Add an auction', errors: errors })
    } else {
      if (start) {
        start = "ongoing"
        switch (length) {
          case 'min':
            duration = 60 * 2;
            break;
          case 'one':
            duration = 60 * 60 * 24;
            break;
          case 'three':
            duration = 60 * 60 * 24 * 3;
            break;
          case 'seven':
            duration = 60 * 60 * 24 * 7;
            break;
          case 'ten':
            duration = 60 * 60 * 24 + 10;
            break;
        }
      } else {
        start = "waiting"
      }
      if (!buynowprice) {
        buyable = true;
      }
      var newAuction = new Auction({
        name: name,
        description: description,
        bid: bid,
        buynowprice: buynowprice,
        buyable: buyable,
        image: 'https://vignette.wikia.nocookie.net/project-pokemon/images/4/47/Placeholder.png',
        owner: req.user.id,
        highestBidder: '',
        allBiders: [],
        state: start,
        length: duration
      });

      newAuction.save((err, auction) => {
        if (err) {
          req.flash('error_msg', 'There was an error with your auction, please try again!');
          res.redirect('addAuction');
        } else {
          req.flash('success_msg', 'Succesfully added your auction!');
          setTimeout(function () { update(auction) }, auction.length * 1000);
          res.redirect('/auctions');
        }
      });
    }
  });

  router.get('/:id', function (req, res, next) {
    var logged;
    var owner;
    var editable;
    var finished;
    var bidable;
    var bid;
    if (req.user) {
      logged = true;
    }
    Auction.getById(req.params.id, function (err, auction) {
      if (err) {
        res.redirect("/auctions");
      } else {
        if (auction) {
          if (req.owner){
            if (auction.owner === req.user.id) owner = true;
          }
          if (auction.state === "waiting") editable = true;
          if (auction.state === "finished") finished = true
          if (auction.bidable === true) bidable = true;
          res.render('auction', { title: 'μBay', auction: auction, is_logged: logged, is_owner: owner, is_editable: editable, is_bidable: bidable, bid: bid, is_finished: finished });
        } else {
          res.redirect("/auctions");
        }
      }
    });
  });

  router.post('/:id', ensureAuthenticated, function (req, res, next) {
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
              res.redirect('/auctions');
            }
            res.redirect('/auctions');
          });
        } else {
          Auction.findByIdAndUpdate(req.params.id, { $set: { bid: bid, highestbider: req.user.id }, $push: { allbiders: req.user.id } }, function (err, updatedauction) {
            if (err) {
              req.flash('error_msg', 'There was an error with your auction, please try again!');
              res.redirect('/auctions');
            }
            res.redirect('/auctions');
          });
        }
      } else if (!bid && req.user.id !== auction.owner) {
        Auction.findByIdAndUpdate(req.params.id, { $set: { bid: bid, highestbider: req.user.id, state: 'finished' }, $push: { allbiders: req.user.id } }, function (err, updatedauction) {
          if (err) {
            req.flash('error_msg', 'There was an error with your auction, please try again!');
            res.redirect('/auctions');
          }
          res.redirect('/auctions');
        });
      } else {
        req.flash('error_msg', 'You cant bid lower than the minimum bid');
        res.redirect('/auctions/' + req.params.id);
      }
    });
  });

  router.get('/:id/edit', ensureAuthenticated, function (req, res, next) {
    Auction.getById(req.params.id, function (err, auction) {
      res.render('editAuction', { title: 'Edit auction - μBay', auction: auction });
    });
  });

  router.post('/:id/edit', ensureAuthenticated, function (req, res, next) {
    var name = req.body.name;
    var description = req.body.description;
    var bid = req.body.bid;
    var buynowprice = req.body.buynow;
    var length = req.body.length;
    var duration;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('description', 'Surname is required').notEmpty();
    req.checkBody('bid', 'Wrong min. bid format').isDecimal({ decimal_digits: '2' });
    req.checkBody('buynow', 'Wrong price format').isDecimal({ decimal_digits: '2' });
    req.checkBody('length', 'Please pick a valid length').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
      res.render('addAuction', { title: 'Add an auction', errors: errors })
    } else {
      switch (length) {
        case 'min':
          duration = 60 * 2
          break;
        case 'one':
          duration = 60 * 60 * 24
          break;
        case 'three':
          duration = 60 * 60 * 24 * 3
          break;
        case 'seven':
          duration = 60 * 60 * 24 * 7
          break;
        case 'ten':
          duration = 60 * 60 * 24 + 10
          break;
      }

      Auction.getById(req.params.id, function (err, auction) {
        Auction.findByIdAndUpdate(req.params.id, { $set: { name: name, description: description, bid: bid, buynowprice: buynowprice, length: duration } }, function (err, updatedauction) {
          if (err) {
            req.flash('error_msg', 'There was an error with your auction, please try again!');
            res.redirect('/auctions');
          }
          res.redirect('/auctions');
        });
      });
    }
  });

  router.get('/:id/start', ensureAuthenticated, function (req, res, next) {
    Auction.getById(req.params.id, function (err, auction) {
      Auction.findByIdAndUpdate(req.params.id, { $set: { state: 'ongoing' } }, function (err, updatedauction) {
        if (err) {
          req.flash('error_msg', 'There was an error with your auction, please try again!');
          res.redirect('/auctions');
        }
        setTimeout(function () { update(updatedauction) }, updatedauction.length * 1000);
        res.redirect('/auctions');
      });
    });
  });

  io.of('/auctions').on('connect', (socket) => {
    socket.on('update', data => {
      io.of('/auctions').emit('changeView', data);
    })
  });
  return router;
};
