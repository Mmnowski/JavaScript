var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user')
var expressValidator = require('express-validator');
router.use(expressValidator());

router.get('/register', function(req, res, next) {
  res.render('register', {title: 'Register'});
});

router.get('/login', function (req, res, next) {
  res.render('login', {title: 'Login'});
});

router.post('/register', function (req, res, next) {
  var name = req.body.name;
  var surname = req.body.surname;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  req.checkBody('name', 'Name is required').notEmpty();
  req.checkBody('surname', 'Surname is required').notEmpty();
  req.checkBody('email', 'E-mail is required').notEmpty();
  req.checkBody('email', 'Invalid e-mail').isEmail();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if(errors){
    res.render('register', {title: 'Register', errors:errors})
  } else {
    var newUser = new User({
      name:name,
      surname:surname,
      email:email,
      username:username,
      password:password
    });

    newUser.save((err, user) => {
      if (err){
        req.flash('error_msg', 'Username or email already in use!');
        res.redirect('register');
      } else {
        req.flash('success_msg', 'Registration successfull! You can now login');
        res.redirect('login');
      }
    });
  }
});-

passport.use(new LocalStrategy(
  function (username, password, done) {
    User.getByUsername(username, (err, user) => {
      if(err) throw err;
      if(!user){
        return done(null, false, {message: 'Invalid username'});
      }
      User.comparePassword(password, user.password, (err, isMatch) => {
        if(err) throw err;
        if(isMatch){
          return done(null, user);
        } else {
          return done(null, false, {message: 'Invalid password'});
        }
      })
    });
  }
));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.getById(id, function (err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {succesRedirect:'/', failureRedirect:'/users/login', failureFlash: true}),
  function (req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    res.redirect('/');
  });

  router.get('/logout', function (req, res) {
    req.logout();

    req.flash('succes_msg', 'You are logged out');

    res.redirect('login')
  })

module.exports = router;
