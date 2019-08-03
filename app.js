var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const rooms = require('./routes/rooms');
// configure sessions
const session = require('express-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//sessions
app.use(session({ secret: 'secret-unique-code', cookie: { maxAge: 3600000 }, resave: true, saveUninitialized: true }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/rooms', rooms);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//Database Setup
var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://royboy:livefully1997@makereddit-zjlxt.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true});
mongoose.Promise = global.Promise;
let db = mongoose.connection;
//request listener
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


module.exports = app;