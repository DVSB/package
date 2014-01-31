

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
            require("../lib/echo")("event: "+event+": "+path);
            require("../lib/plugins");
        });

    };


    module.exports.localhostInit = function() {

        require("../lib/echo")("browse localhost:3008 for your website");

        // yes, nodejs is so awesome, that you need only this for server
        // cool right?
        // TODO add optional port setting
        var options = require("connect")().use(require("connect").static("./%build"));
        require("http").createServer(options).listen(3008).on("error", errorHandling);

    };


    module.exports.dashboardInit = function() {

        require("../lib/echo")("browse localhost:3009 for dashboard");

        // yes, nodejs is so awesome, that you need only this for server
        // cool right?
        // TODO add optional port setting
        var options = require("connect")().use(require("connect").static(__dirname+"/../dashboard/"));
        require("http").createServer(options).listen(3009).on("error", errorHandling);

    };


    function errorHandling(e){

        if (e.code==="EADDRINUSE") {
            require("../lib/echo")("port 3008 is already used", true);
        }

    }

