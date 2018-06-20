const express           = require('express');
const library1          = require('./libraries/library1');
const routes1           = require('./routes/routes1');
const my_middleware1    = require('./middlewares/my-middleware1.js');
const responseTime      = require('response-time');
const vhost             = require('vhost');
const app               = express();


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
}))

// Routes 1
app.get('/', function(req, res) {
    res.send('Hello World!');
});

app.get('/users/:userId/:bookId', function (req, res) {
    res.send(req.params)
});

// use Router (Routes 2)
app.use(routes1);



app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});