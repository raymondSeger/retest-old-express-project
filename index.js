const express           = require('express');
const library1          = require('./libraries/library1');
const routes1           = require('./routes/routes1');
const my_middleware1    = require('./middlewares/my-middleware1.js');
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