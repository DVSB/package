

    "use strict";


    // in case of development nothing is run because its in exports
    if (process.env.PWD==="/Users/samuel/Documents/mdown/web" || !env){

        watchFolderAndGenerate();
        createLocalhost();

    } else {

        // exports are public properties of this file
        module.exports = function(){

            watchFolderAndGenerate();
            createLocalhost();

        };

    }


    // real application should just run functions
    function watchFolderAndGenerate(){

        // be welcome my friend message to console
        require("../lib/echo")("0001");

        // choose one command (watch, deploy, preview, create)
        require("./cmnd-switch")(process.argv[2]);

    }

    // real application should just run functions
    function createLocalhost(){

        // message "browse this shit on localhost:3008" to console
        require("../lib/echo")("0007");

        // yes, nodejs is so awesome that you need only this for server
        // cool right?
        var connect = require("connect");
        var http = require("http");
        http.createServer(connect().use(connect.static("./%build")))
            .listen(3008)
            .on("error", errorHandling);

    }

    function errorHandling(e){

        if (e.code==="EADDRINUSE") require("../lib/echo")("e0001");

    }
