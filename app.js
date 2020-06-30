const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./models/db');
const MongoStore = require('connect-mongo')(session);

const flash = require('connect-flash');

const indexRouter = require('./routes/routes.index');
const usersRouter = require('./routes/routes.users');
const locationsRouter = require('./routes/routes.locations');

const app = express();

//session
app.use(
    session({
        secret: 'project6', // secret key for the session
        resave: true, // forces the session to be saved back to the session store
        saveUninitialized: true, // saves data from anonymous sessions
        store: new MongoStore({ mongooseConnection: db.mongoose.connection }),
    })
);

app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

// Store session logged in variable in locals
// Create local variables for absolute path names to use in
// ejs include function
app.use(function (req, res, next) {
    res.locals.loggedIn = req.session.loggedIn;
    res.locals.isAdmin = req.session.isAdmin;
    res.locals.headerPartial = __dirname + '/views/partials/header';
    res.locals.footerPartial = __dirname + '/views/partials/footer';
    next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/locations', locationsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
