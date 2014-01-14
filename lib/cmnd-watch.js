

    "use strict";


    module.exports = function() {

        // only global variables in application (for easier funcionality)
        var COWEB = require("./lib-cobweb")();
        var UNDERS = require("./lib-underscore")();

        // watch user current folder (and in dev this folder)
        require("./lib-chokidar");

    };

