

    "use strict";


    var log = require("./echo");


    console.log();
    log("browse http://localhost::8088 for a build preview");
    log("watching "+process.env.PWD);
    console.log();


    // require underscore to global scope, it's used everywhere
    require("../mdls/underscore/export")(function(_underscore){
	    global._ = global.underscore = _underscore;
    });


    var _checkIfDownpressDirectories = function(){

        var isExistsTemplates = require("fs").existsSync('./%templates/');

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
            interval : 300,
            ignoreInitial : true
        };

        // initial build
        require("./plugins")();

        // watch this folder with options, every 100ms regenerate whole folder
        require("chokidar").watch("./", options).on("all", function(event, path){

	        downpress.lastChanged = { event : event, path : path };

	        // what if next change is faster than folder is regenerated?
            if (!global.downpress.isGenerating) {
	            log("on `"+event+"` in `"+path +"`");
	            require("./plugins")();
            }

        });

    };


    var _watchLocalhost = function(){

        // TODO add optional port setting

        function errorHandling(e){
            if (e.code==="EADDRINUSE") {
	            log("error -- port 8088 is already used by other process", true);
	            console.log();
	            process.kill();
            }
        }

        var options = require("connect")().use(require("connect").static("./%build"));
	    require("http").createServer(options).listen(8088).on("error", errorHandling);

    };


    var _readPackageJson = function(){

	    var contentOfPackage = require("fs").readFileSync("./package.json");
	    global.downpress.config = JSON.parse(contentOfPackage).downpress;
	    global.downpress.package = JSON.parse(contentOfPackage);

    };


    _readPackageJson();
    _checkIfDownpressDirectories();
    _watchLocalhost();
    _watchInitialization();
