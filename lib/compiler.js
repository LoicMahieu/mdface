
/*
 * GET home page.
 */

var marked = require('marked');
var hljs = require('highlight.js');
var fs = require('fs');

marked.setOptions({
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  langPrefix: 'lang-'
});

module.exports = function (file) {
  return function (callback) {
    fs.readFile(file, function (err, content) {
      if (err) {
        return callback(err);
      }

      marked(content.toString('utf-8'), {}, function (err, content) {
        if (err) {
          return callback(err);
        }

        callback(null, content);
      });
    });
  };
};
