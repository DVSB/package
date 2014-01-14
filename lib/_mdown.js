

    "use strict";


    // exports are public properties of this file
    module.exports = function(){

        application();

    };


    // in case of development nothing is run because its in exports
    if (process.env.PWD==="/Users/samuel/Documents/mdown/web"){

        application();

    }


    // real application should just run functions
    function application(){

        // be welcome my friend message to console
        require("./echo")("0001");

        // choose one command (watch, deploy, preview, create)
        require("./cmnd-switch")(process.argv[2]);

    }
