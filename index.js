const express           = require('express');
const library1          = require('./libraries/library1');
const routes1           = require('./routes/routes1');
const my_middleware1    = require('./middlewares/my-middleware1.js');
const responseTime      = require('response-time');
const vhost             = require('vhost');
const compression       = require('compression');
const helmet            = require('helmet');
const session           = require('express-session');
const cookieParser      = require('cookie-parser');
const multer            = require('multer');
const upload            = multer();
const bodyParser        = require('body-parser');
const redis             = require('redis');
const client            = redis.createClient(6379, 'localhost');
const RedisStore        = require('connect-redis')(session);
const app               = express();
const http              = require('http').Server(app);
const io                = require('socket.io')(http);

io.on('connection', function(socket){
    console.log('a user connected');
});


var myLoggerMiddleware = function (req, res, next) {
    console.log('LOGGED');
    next();
};
var myURLDeciderMiddleware = function (req, res, next) {
    console.log('check the req.url and redirect to correct server');
    next();
};

// App middlewares
app.use(myLoggerMiddleware);
app.use(myURLDeciderMiddleware);
app.use(my_middleware1({
    option1: '1',
    option2: '2'
}));
app.use(responseTime());
app.use(vhost('*.testexpressdev.com', function handle (req, res, next) {
    // for match of "testsubdomain.testexpressdev.com:*" against "*.*.testexpressdev.com":
    console.dir(req.vhost.host); // => 'foo.bar.testexpressdev.com:8080'
    console.dir(req.vhost.hostname); // => 'foo.bar.testexpressdev.com'
    console.dir(req.vhost.length); // => 2
    console.dir(req.vhost[0]); // => 'testsubdomain'
    console.dir(req.vhost[1]); // => undefined
}));
app.use(compression({'level': 9}));
app.use(helmet());
app.use(session({
    store: new RedisStore({
        'client': client,
    }),
    secret: 'keyboard cat',
    resave: false
}));
app.use(cookieParser('the_secret_key_for_browser_cookie', {}));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Routes 1
app.get('/', function(req, res) {
    res.send('Hello World!');
});

app.get('/socketio', function(req, res) {
    res.sendFile(__dirname + '/socketio.html');
});

app.get('/session-data', function(req, res) {
    if (req.session.views) {
        req.session.views   = req.session.views + 1;
        let total_view      = req.session.views;
        res.setHeader('Content-Type', 'text/html');
        res.write('<p>views: ' + req.session.views + '</p>');
        res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>');
        res.end();
    } else {
        req.session.views = 1;
        res.send('Hello World from session-data!');
    }
});
app.get('/get-cookie-data-with-cookie-parser', function(req, res) {
    // Cookies that have not been signed
    if(req.cookies.views_browser == undefined) {
        req.cookies.views_browser    = 1;
    }
    res.setHeader('Content-Type', 'text/html');
    res.cookie('set_new_cookie', 123, { maxAge: 900000, httpOnly: false });
    res.write('<p>views: ' + req.cookies.views_browser + '</p>');
    res.end();
});

app.get('/set-redis-data', function(req, res) {
    client.set("some key", "some val");
    client.set(["some other key", "some val"]);

    client.get("some key", function(err, reply) {
        // reply is null when the key is missing
        console.log(reply);
    });

    res.send('Hello World!');
});

// get "form-data" with multer
app.post('/get-form-data', upload.array(), function(req, res){
    console.log(req.body);
    res.send('Got your data!');
});

// get "x-www-form-urlencoded" data with body-parser
app.post('/get-form-data-2', function(req, res) {
    console.log(req.body);
    res.send('Got your data!');
});

app.get('/users/:userId/:bookId', function (req, res) {
    res.send(req.params)
});

// use Router (Routes 2)
app.use(routes1);

http.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});