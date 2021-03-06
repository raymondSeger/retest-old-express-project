var express = require('express');
var path    = require('path');
var router = express.Router();

// middleware that is specific to this router / Router Middleware
router.use(function timeLog (req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

// define the home page route
router.get('/admin/page1', function (req, res) {
    var a = __dirname;
    var b = path.join(__dirname, 'public');
    res.send('Admin page 1 page');
});

// define the about route
router.get('/admin/page2', function (req, res) {
    res.send('Admin page 2 page');
});

module.exports = router;