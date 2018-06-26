var createError = require('http-errors');
var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressValidator = require('express-validator');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var lessMiddleware = require('less-middleware');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(session);
var socketio = require('socket.io');
var passportsocketio = require('passport.socketio');


var mongo = require('mongodb')
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/microbay');
var db = mongoose.connection;


var app = express();

app.engine('hbs', exphbs({
  extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/', partialsDir: __dirname + '/views/partials/', helpers: {
    section: function (name, options) {
      if (!this._sections) this._sections = {};
      this._sections[name] = options.fn(this);
      return null;
    }
  }
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

const sessionSecret = 'okres godowy chomika wynosi trzy miesiace';
const sessionKey = 'express.sid';
const store = new MongoStore({
  url: 'mongodb://localhost/microbay',
  ttl: 600
});

app.use(session({
  key: sessionKey,
  secret: sessionSecret,
  saveUninitialized: true,
  resave: true,
  store: store
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

app.use(flash());
// error handler
app.use(function (req, res, next) {
  // set locals, only providing error in development
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

var io = socketio();
io.use(passportsocketio.authorize({
  cookieParser: cookieParser,
  secret: sessionSecret,
  store: store,
  key: sessionKey
}));
app.io = io;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var auctionsRouter = require('./routes/auctions');
var profileRouter = require('./routes/profile');
var messagesRouter = require('./routes/messages')(io);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auctions', auctionsRouter);
app.use('/profile', profileRouter);
app.use('/messages', messagesRouter);

module.exports = app;
