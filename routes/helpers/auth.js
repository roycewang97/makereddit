//check the existence of a session and if there is a user id from the mongodb users collection
exports.requireLogin = (req, res, next) => {
  if(req.session && req.session.userId) {
    return next();
  } else {
    let err = new Error('You must log in to view this page');
    err.status = 401;

    return res.redirect('/login');
  }
}