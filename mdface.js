
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var socketio = require('socket.io');
var fs = require('fs');
var _ = require('lodash');
var routes = require('./routes');
var compiler = require('./lib/compiler');
var colors = require('colors');

module.exports = function mdface (file, options) {
  var app = express();
  var server = http.createServer(app);
  var io = socketio.listen(server);

  options = _.merge({
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost'
  }, options);
  
  // Setup markdown compiler
  app.compiler = compiler(file);

  // all environments
  app.set('markdownfile', file);
  app.set('port', options.port);
  app.set('host', options.host);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.static(path.join(__dirname, 'public')));

  app.get('/', routes.index);

  // Start watching
  fs.watchFile(file, { persistent: true, interval: 500 },  function (curr, prev) {
    app.compiler(function (err, content) {
      io.sockets.emit('markdownfile', content);
    });
  });

  // On connection, compile and send it
  io.sockets.on('connection', function (socket) {
    app.compiler(function (err, content) {
      socket.emit('markdownfile', content);
    });
  });

  // Start listening
  server.listen(app.get('port'), function() {
    console.log(
      colors.green('File: ') + file
    );
    console.log(
      colors.green('Listening:') + ' http://' + options.host + ':' + options.port
    );
    app.emit('listening');
  });

  return app;
};
