

    "use strict";


    var log = require("./echo");


    console.log();
    log("browse http://localhost:3008 (or :8088) for a build");
    log("watching "+process.env.PWD);
    console.log();

    var _checkIfDownpressDirectories = function(){

        var filesystem = require("fs");

        var isExistsTemplates = filesystem.existsSync('./%templates/');

        if (!isExistsTemplates) {
            log("error -- missing `%templates` folder!", true);
            log("or download boilerplate from github.com/donwpress/boilerplate", true);
            log("or generate boilerplate `downpress init`", true);
            log("(.. find more on downpress.org/start/)", true);
            console.log();
            process.kill();
        }

    };


    var _watchInitialization = function(){

        var options = {
            ignored : /%build/,
            persistent : true,
            interval : 200,
            ignoreInitial : true
        };

        // initial build
        require("./plugins")();

        // watch this folder with options, every 5s, for every change
        require("chokidar").watch("./", options).on("all", function(event, path){

            log("regenerated on "+event+": "+path);
            if (!global.downpress.isGenerating) require("./plugins")();

        });

    };


    var _watchLocalhost = function(){

        // TODO add optional port setting

        function errorHandling(e){
            if (e.code==="EADDRINUSE") log("port 3008 or 8088 can be already used", true);
        }

        var options = require("connect")().use(require("connect").static("./%build"));
        require("http").createServer(options).listen(3008).on("error", errorHandling);
	    require("http").createServer(options).listen(8088).on("error", errorHandling);

    };

    _checkIfDownpressDirectories();
    _watchLocalhost();
    _watchInitialization();
