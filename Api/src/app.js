const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan'); 
const cors = require('cors')
// const session = require('express-session')
const routes = require('./routes/index.js'); 

require('./db.js');

const server = express();

server.name = 'API';
// server.use(cors({ 
//   origin: ["*"],  
//   methods: ['GET' , "POST" , "DELETE" , "PUT" , "OPTIONS"], 
//   credentials: true
// }))  
// server.use(session({ 
//   key: "userId", 
//   secret: "parfumApi", 
//   resave: false,
//   saveUninitialized: false, 
//   cookie: {
//     expires: 60 * 60 * 24,
//   }
// }))
server.use(cors())
server.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
server.use(bodyParser.json({ limit: '50mb' }));
server.use(cookieParser());
server.use(morgan('dev'));
 server.use((req, res, next) => {
   res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
   res.header('Access-Control-Allow-Credentials', 'true');
   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
   next();
 });

server.use('/', routes);
server.use("/.netlify/functions/api", routes)

// Error catching endware.
server.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
