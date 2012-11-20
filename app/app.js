var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    mongoose = require('mongoose'),
    wines = require("./lib/backbone-sample.js");

var app = express();

// Config
app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/api', function (req, res) {
  res.send('Ecomm API is running');
});

app.get('/api/wines', function (req, res) {
  wines.getWines(function (err, wines) {
    if (!err) {
      return res.send(wines);
    } else {
      return console.log(err);
    }
  })
});

app.get('/api/wines/:id', function (req, res){
  wines.getWine(req.params.id, function (err, wine) {
    if (!err) {
      return res.send(wine);
    } else {
      return console.log(err);
    }
  });
});

app.post('/api/wines', function (req, res){
  wines.addWine(req.body, function (err) {
    if (!err) {
      return console.log("created");
    } else {
      return console.log(err);
    }
  });
  res.send(200, "OK");
});

var host = process.env['DOTCLOUD_DB_MONGODB_HOST'] || 'helloworld-gfronza-db-0.azva.dotcloud.net';
var port = process.env['DOTCLOUD_DB_MONGODB_PORT'] ||  40992;
port = parseInt(port);
var username = process.env['DOTCLOUD_DB_MONGODB_LOGIN'] || 'root';
var password = process.env['DOTCLOUD_DB_MONGODB_PASSWORD'] || 'CGXz6Qxb1zCTjFPA3uOq';

var opts = { server: { auto_reconnect: true }, user: username, pass: password }
db = mongoose.createConnection(host, 'admin', port, opts)


wines.init(mongoose, db);

// Launch server

app.listen(8080);