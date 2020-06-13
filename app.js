const express = require('express'),
    path = require('path'),
    favicon = require('express-favicon'),
    expressValidator = require('express-validator'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    mongdb = require('mongodb'),
    db = require('monk')('localhost/pin'),
    multer = require('multer'),
    flash = require('connect-flash'),
    exphbs = require('express-handlebars'),
    moment = require('moment'),
    app = express();

var index = require('./routes/index');
var posts = require('./routes/posts');
var categories = require('./routes/categories');
// view engine setup


hbsEngine = exphbs.create({
    extname: 'handlebars',
    defaultLayout: 'main.handlebars',
    helpers: {
        formatDate: function(date, format) {
            return moment(date).format("MM-DD-Y");
        },
        truncateText: function(text) {

            return text.fn(this).substring(0, 150)
        }
    }
});

app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', hbsEngine.engine);
app.set('view engine', 'handlebars');

// uploads
var uploads = multer({ dest: './public/images/uploads' })

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(cookieParser());
// save sessions
app.use(session({
        secret: 'iknowyoursecret',
        saveUninitialized: true,
        resave: true
    }))
    // express validator 
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

//static files
app.use(express.static(path.join(__dirname, 'public')));

// flash
app.use(flash())
app.use(function(req, res, next) {
    res.locals.message = require('express-messages')(req, res);
    next();
});
// db
app.use(function(req, res, next) {
    req.db = db;
    next();
});



app.use('/', index);
app.use('/posts', posts);
app.use('/categories', categories);
// Handle 404
app.use(function(req, res) {
    res.status(400);
    res.render('404.handlebars', { title: '404' });
});

// Handle 500
app.use(function(error, req, res, next) {
    res.status(500);
    res.render('500.handlebars', { title: '500', error: error });
});
port = 9000

app.listen(port, () => {
    console.log(`listening on port ${port}...`)
})

//http-localhost-9000-1.disqus.com