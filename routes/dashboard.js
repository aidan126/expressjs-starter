var express = require('express');
var router = express.Router();

var db = require('../databse.js');
var session;
var loginid;

router.use(function(req, res, next) {
  session = req.session;
  if (session['ssid']) {
    //logined
    loginid = session.ssid;
  } else {
    res.redirect('/login');
  }
  next();
});


module.exports = router;
