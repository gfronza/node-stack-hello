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

var host = process.env['DOTCLOUD_DB_MONGODB_HOST'] || 'localhost';
var port = process.env['DOTCLOUD_DB_MONGODB_PORT'] ||  27017;
port = parseInt(port);
var user = process.env['DOTCLOUD_DB_MONGODB_LOGIN'] || undefined;
var pass = process.env['DOTCLOUD_DB_MONGODB_PASSWORD'] || undefined;

var opts = (user && pass) ? { server: { auto_reconnect: true }, user: user, pass: pass } : { server: { auto_reconnect: true } };
var db = mongoose.createConnection(host, 'helloworld', port, opts);

wines.init(mongoose, db);

// Launch server

app.listen(8080);