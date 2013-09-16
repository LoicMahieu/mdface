
/*
 * GET home page.
 */

var marked = require('marked');
var hljs = require('highlight.js');
var fs = require('fs');

marked.setOptions({
  gfm: true,
  highlight: function (code, lang, callback) {
    lang = fixLang(lang);
    if (lang) {
      callback(null, hljs.highlight(lang, code).value);
    } else {
      callback(null, code);
    }
  },
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false,
  langPrefix: 'lang-'
});

var fixLang = function (lang) {
  lang = (lang || '').toLowerCase();
  switch (lang) {
    case "js": return "javascript";
    case "sh": return "bash";
    default:
      if (hljs.LANGUAGES[lang] < 0)
        return '';
  }
  return lang;
};

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
