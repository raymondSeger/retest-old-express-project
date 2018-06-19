const express   = require('express');
const library1  = require('./libraries/library1');
const app       = express();

app.get('/', function(req, res) {
    res.send('Hello World!');
});

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});