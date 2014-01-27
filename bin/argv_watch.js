

    "use strict";


    module.exports.initialization = function() {

        var options = {
            ignored : /%build/,
            persistent : true,
            interval : 2000,
            ignoreInitial : true
        };

        // watch this folder with options, every 5s, for every change
        require("chokidar").watch("./", options).on("all", function(event, path){
            require("../lib/echo2")("event: "+event+": "+path);
            require("../lib/generate");
        });

    };


    module.exports.localhostInit = function() {

        require("../lib/echo2")("browse your website on localhost:3008");

        // yes, nodejs is so awesome, that you need only this for server
        // cool right?
        // TODO add optional port setting
        var options = require("connect")().use(require("connect").static("./%build"));
        require("http").createServer(options).listen(3008).on("error", errorHandling);

    };


    function errorHandling(e){

        if (e.code==="EADDRINUSE") {
            require("../lib/echo2")("port 3008 is already used", true);
        }

    }

