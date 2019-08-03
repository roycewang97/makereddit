const express = require('express');
const router = express.Router();
const User = require('../models/user');
//create an instance of export-one instance that requires the auth file-just an execution code
const auth = require ('./helpers/auth.js');

//Users index
router.get('/', auth.requireLogin, (req, res, next) => {
  //requireLogin checks for session existence and userid cookie
  User.find({}, 'username', function(err, users) {
    if(err) {
      console.error(err);
    } else {
      res.render('users/index', { users: users });
    }
  });
});

// Users new
router.get('/new', (req, res, next) => {
  res.render('users/new');
})

// Users create
router.post('/', (req, res, next) => {
  const user = new User(req.body);

  user.save(function(err, user) {
    if(err) console.log(err);
    return res.redirect('/users');
  });
})

module.exports = router;