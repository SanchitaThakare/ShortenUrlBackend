require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors')

const ResponseCodes = require("./utils/response.code");

var corsOptions = {
  origin: "*"
}

const app = express();
app.use(express.static(path.join(__dirname, './public')))


const MONGO_URI = 'mongodb://localhost:27017/short-url';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

let response_code = new ResponseCodes();
let server_status = response_code.serverError().status;

/* The code snippet `app.use(cors(corsOptions)); app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));` in your
Express application is setting up middleware functions to handle CORS (Cross-Origin Resource
Sharing) and parse incoming request bodies. */
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

app.use('/api', require('./routes/shortUrl.routes'));

app.use('/', require('./routes/url.routes'));


/* This piece of code is a middleware function in Express that handles errors. When an error occurs in
any of the previous middleware functions or route handlers, it will be passed to this error handling
middleware. */
app.use((err, req, res, next) => {
  if (err) {
    response_code.message = 'Something went wrong - Please try again.';
    response_code.error = err;
    return res.status(server_status).send(response_code.serverError());
  }
  next();
});

/* This piece of code is setting up the port for the Express server to listen on. */
const PORT = process.env.PORT ?? 3080;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));