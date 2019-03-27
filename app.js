var createError = require('http-errors');
var express = require('express');
var path = require('path');

var indexRouter = require('./routes/index');
var personRouter = require('./routes/person');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static files are in the public directory. Second line means that "public/" must be included
// in the path. This prevents loading the static index.html instead of using "/" route and allows
// the two versions of the app (static & express) to use the same filepath for public files.
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static('public'))

app.use('/', indexRouter);
app.use('/person', personRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('layout', {
    view: 'error',
    title: 'Error',
  });
});

module.exports = app;
