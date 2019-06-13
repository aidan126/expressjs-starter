var express = require('express');
var router = express.Router();
var Userlog = require('debug')('time');
var db = require('../databse.js');
var session;

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  Userlog('Time: ', Date.now());
  next();
});

router.get('/', function(req, res) {
  session = req.session;
  if (session.ssid) res.redirect('/dashboard');
  else res.redirect('/login');
});

router
  .route('/login')
  .get(function(req, res) {
    res.render('login.html');
  })
  .post(function(req, res) {
    let queryStr = { id: req.body.id, password: req.body.password };
    db.findDocuments('users', queryStr, function(docs) {
      if (docs.length === 0) {
        console.log('id no exist');
        res.end('invalid password or id no exist');
      } else {
        console.log('login successful');
        //set the session var `ssid`
        session.ssid = req.body.id;
        res.redirect('/dashboard');
      }
    });
  });

router
  .route('/register')
  .get(function(req, res) {
    res.render('register.html');
  })
  .post(function(req, res) {
    var id = req.body.id;
    var password = req.body.psw;
    let queryStr = { id: id, password: password };
    db.insertDocuments('users', [queryStr], function(docs) {});
    res.redirect('/');
  });

router.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});
module.exports = router;
