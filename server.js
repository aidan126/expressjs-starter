'use strict';

require('dotenv').config();

//------------------------- load the environment variable
const sessionKey = process.env.SECRET_KEY,
  port = process.env.PORT || 1337;

//--
//--------------------------------------------------------

// Imports dependencies and set up http server
const express = require('express'),
  body_parser = require('body-parser'),
  app = express(),
  session = require('express-session'),
  userRouter = require('./routes/userRoute.js');

// create application/x-www-form-urlencoded parser
const urlencodedParser = body_parser.urlencoded({ extended: false });
app.use(urlencodedParser);

//create session
app.use(session({ secret: sessionKey }));

app.use('/', userRouter);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// Sets server port and logs message on success
app.listen(port, () => console.log(`app listening on port ${port}!`));

// app.post("/restaurant", upload.array());
