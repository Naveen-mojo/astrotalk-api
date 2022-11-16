const express = require("express");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
const bodyParser = require('body-parser');

const app = express();

let server = require('http').Server(app);
let io = require('socket.io')(server);
let stream = require('./app/ws/stream');
let path = require('path');


let corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse request data content type application/json
app.use(bodyParser.json({ limit: '1000mb' }));

const db = require("./app/models");
const Role = db.role;

app.use('/upload', express.static('upload'));

// db.mongoose
//   .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .then(() => {
//     console.log("Successfully connect to MongoDB.");
//     // initial();
//   })
//   .catch(err => {
//     console.error("Connection error", err);
//     process.exit();
//   });

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-Width, Content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to astrotalk application." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

app.use('/assets', express.static(path.join(__dirname, 'app/assets')));

app.get('/videocall', (req, res) => {
  res.sendFile(__dirname + '/app/index.html');
});


io.of('/stream').on('connection', stream);


// set port, listen for requests
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}
