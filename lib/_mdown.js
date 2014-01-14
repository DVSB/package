

    "use strict";


    // exports are public properties of this file

    module.exports = function(){

        application();

    };


    // in case of development needs to be run default function

    if (process.env.PWD==="/Users/samuel/Documents/mdown/web"){

        application();

    }


    // real application should just run functions

    function application(){

        // be welcome my friend message
        require("./echo")("0001");

        // choose one submodule
        require("./cmnd-switch")(process.argv[2]);

    }
