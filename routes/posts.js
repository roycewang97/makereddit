const express = require('express');
const router = express.Router({mergeParams: true});
const auth = require('./helpers/auth');
const Room = require('../models/room');
const Post = require('../models/post');

//comments route
const comments = require('./comments');

//post new
router.get('/new', auth.requireLogin, (req, res, next) => {
  Room.findById(req.params.roomId, function(err, room) {
    if(err) { console.error(err) };

    res.render('posts/new', { room: room });
  });
});

//post show-routes to room/show and passes post id and loads comments to the room/show hbs file
router.post('/', auth.requireLogin, (req, res, next) => {
  Room.findById(req.params.roomId, function(err, room) {
    if(err) { console.error(err) };

    let post = new Post(req.body);
    post.room = room;

    post.save(function(err, post) {
      if(err) { console.error(err) };
        //used backticks to accomodate expression in js-just a syntax thing
      return res.redirect(`/rooms/${room._id}`);
    });
  });
});

//post update votes
router.post('/:id', auth.requireLogin, (req, res, next) => {
  Post.findById(req.params.id, function(err, post) {
    if (err){ console.error(err); }
    post.points += parseInt(req.body.points);
    post.save(function (err, post) {
      if (err) { console.error(err); }
      return res.redirect(`/rooms/${post.room}`);
    });
  });
});

router.use('/:postId/comments', comments);

module.exports = router;