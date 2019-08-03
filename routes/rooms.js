const express = require('express');
const router = express.Router();

const auth = require('./helpers/auth');
//model data
const Room = require('../models/room');
const Post = require('../models/post');

//require controller
const posts = require('./posts');

// Rooms index
router.get('/', (req, res, next) => {
    Room.find({},'topic', function (err, rooms){
        if (err) {
            console.error(err);
        } else {
            res.render('rooms/index', {rooms: rooms});
        }
    });
});

// Rooms new
router.get('/new', auth.requireLogin, (req, res, next) => {
    res.render('rooms/new');
});

// Rooms show
router.get('/:id', auth.requireLogin, (req, res, next) => {
    Room.findById(req.params.id, function(err, room) {
      if (err) { console.error(err) };
        //we nest queries to the db to pass both to the front-end for rendering
        //may affect performance speed when nesting too many queries
        //.exec is just another syntax for executing callback-alternative syntax
        //setting points property to be passed with value of -1 means descending order for sorting method
      Post.find({ room: room }).sort({ points: -1}).populate('comments').exec(function(err, posts) {
        if(err) { console.error(err) };
  
        res.render('rooms/show', { room : room, posts : posts });
      });
    });
  });

// Rooms edit
router.get('/:id/edit', auth.requireLogin, (req, res, next) => {
    Room.findById(req.params.id, function (err, room) {
        if (err) {
            console.error(err);
        }
        res.render('rooms/edit', { room: room });
    });
});

// Rooms update
router.post('/:id', auth.requireLogin, (req, res, next) => {
  Room.findByIdAndUpdate(req.params.id, req.body, function(err, room) {
      if (err) {
          console.error(err);
      }
      res.redirect('/rooms/'+req.params.id);
  });
});

// Rooms create
router.post('/', auth.requireLogin, (req, res, next) => {
  let room = new Room(req.body);

  room.save(function (err, room){
    if (err) {
        console.log(err);
    }
    return res.redirect('/rooms');
  });
});

//add this line to next the posts route
router.use('/:roomId/posts', posts);

module.exports = router;