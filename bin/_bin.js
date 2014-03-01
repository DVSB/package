#!/usr/bin/env node


    "use strict";


    var _watchInitialization = function(){

        var options = {
            ignored : /%build/,
            persistent : false,
            interval : 100,
            ignoreInitial : true
        };

        // initial build
        require("./plugins")();

        // watch this folder with options, every 5s, for every change
        require("chokidar").watch("./", options).on("all", function(event, path){
            require("./echo")("event: "+event+": "+path);
            require("./plugins")();
        });

    };

    var _watchLocalhost = function(){

        function errorHandling(e){
            if (e.code==="EADDRINUSE") {
                require("./echo")("port 3008 is already used", true);
            }
        }

        // yes, nodejs is so awesome, that you need only this for server
        // cool right?
        // TODO add optional port setting
        var options = require("connect")().use(require("connect").static("./%build"));
        require("http").createServer(options).listen(3008).on("error", errorHandling);

    };


    // second CMD argument set by user
    switch (process.argv[2]) {

        case "preview" :
            require("./echo")("welcome in mdown 0.0.20 ~ watching "+process.env.PWD);
            require("./echo")("build (localhost:3008)".bold);
            _watchLocalhost();
            _watchInitialization();
            break;

        case "deploy" :
            console.log("i am in cmdn-deploy");
            break;

        case "init" :
            require("./bin_init");
            break;

        case "report" :
            require("./bin_report");
            break;

        case "create" :
            console.log("im in cmdn-create");
            break;

        default :
            require("./echo")("you can use only these subcommands: ", true);
            require("./echo")("       preview");
            break;

    }