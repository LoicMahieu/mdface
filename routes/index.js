
exports.index = function(req, res){
  res.render('index', {
    markdownfile: res.app.get('markdownfile')
  });
};
