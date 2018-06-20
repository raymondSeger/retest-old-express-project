const express   = require('express');
const library1  = require('./libraries/library1');
const routes1  = require('./routes/routes1');
const app       = express();

app.get('/', function(req, res) {
    res.send('Hello World!');
});

app.get('/users/:userId/:bookId', function (req, res) {
    res.send(req.params)
});

app.use(routes1);

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});