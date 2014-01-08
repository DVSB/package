module.exports = function() {

    // prepare new file in _build for generating
    require('./preparation.js')();

    require('./generate.js')();

};

