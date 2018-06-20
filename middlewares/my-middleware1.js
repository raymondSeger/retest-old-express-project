module.exports = function(options) {

    console.log(options);

    return function(req, res, next) {
        // Implement the middleware function based on the options object
        next()
    }
};