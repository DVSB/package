

    "use strict";


    var log = require("./echo");


    console.log();
    log("browse http://localhost:3008 (or :8088) for a build");
    log("watching "+process.env.PWD);
    console.log();


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
            log("regenerated on "+event+": "+path);
            require("./plugins")();
        });

    };

    var _watchLocalhost = function(){

        // TODO add optional port setting

        function errorHandling(e){
            if (e.code==="EADDRINUSE") {
                log("port 3008 is already used", true);
            }
        }

        var options = require("connect")().use(require("connect").static("./%build"));
        require("http").createServer(options).listen(3008).on("error", errorHandling);
	    require("http").createServer(options).listen(8088).on("error", errorHandling);

    };


    _watchLocalhost();
    _watchInitialization();
