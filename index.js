const express   = require('express');
const library1  = require('./libraries/library1');
const app       = express();

console.log(library1.age);
console.log(library1.func1());

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(3000, () => console.log('Example app listening on port 3000!'));