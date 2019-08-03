var express = require('express');
var router = express.Router();
const User = require('../models/user');

//set layout variables before use
//data is stored in the server to persist across routes-accessible across different routes
router.use(function(req, res, next) {
  res.locals.title = "MakeReddit";
  res.locals.currentUserId = req.session.userId;

  next();
});


/* GET home page. */
// home page
router.get('/', (req, res, next) => {
  const currentUserId = req.session.userId;

  res.render('index', { title: 'MakeReddit', currentUserId: currentUserId });
});

//login
router.get('/login', function (req, res) {
  res.render('login');
});

//POST for login
router.post('/login', function (req, res, next) {
  User.authenticate(req.body.username, req.body.password, (err, user) => {
    if (err || !user) {
      const next_error = new Error("Username or password incorrect");
      next_error.status = 401;
      return next(next_error);
    } else {
      //saving mongo user unique ID of users collection
      req.session.userId = user._id;
      //redirect to home page
      return res.redirect('/') ;
    }
  });
});

//GET logout
router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) return next(err);
    });
  }

  return res.redirect('/login');
});

module.exports = router;

module.exports = router;