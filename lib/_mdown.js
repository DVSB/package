

    "use strict";


    // only global variables in application (for easier funcionality)
    var COWEB = require("./lib-cobweb")();
    var UNDERS = require("./lib-underscore")();


    // export is for bin in case of plugin
    module.exports = function(){
        application();
    };


    // this is for case of development
    if (process.env.PWD==="/Users/samuel/Documents/mdown"){
        application();
    }


    // real application should just run functions
    function application(){

        // be welcome my friend message
        require("./echo")("0001");

        console.log(COWEB);

    }
