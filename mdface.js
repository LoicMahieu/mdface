
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

module.exports = function mdface (file, options) {
  var app = express();
  var server = http.createServer(app);
  var io = socketio.listen(server);

  options = _.extend({
    port: process.env.PORT || 3000
  }, options);

  // Setup markdown compiler
  app.compiler = compiler(file);

  // all environments
  app.set('markdownfile', file);
  app.set('port', options.port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));

  // development only
  if ('development' == app.get('env')) {
    app.use(express.errorHandler());
  }

  app.get('/', routes.index);

  server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
  });

  fs.watchFile(file, { persistent: true, interval: 500 },  function (curr, prev) {
    app.compiler(function (err, content) {
      io.sockets.emit('markdownfile', content);
    });
  });

  io.sockets.on('connection', function (socket) {
    app.compiler(function (err, content) {
      socket.emit('markdownfile', content);
    });
  });

  return app;
};
