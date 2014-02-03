

    "use strict";


    module.exports.initialization = function() {

        var options = {
            ignored : /%build/,
            persistent : false,
            interval : 100,
            ignoreInitial : true
        };

	    // initial build
	    require("../lib/plugins")();

        // watch this folder with options, every 5s, for every change
        require("chokidar").watch("./", options).on("all", function(event, path){
            require("../lib/echo")("event: "+event+": "+path);
            require("../lib/plugins")();
        });

    };


    module.exports.localhostInit = function() {

        // yes, nodejs is so awesome, that you need only this for server
        // cool right?
        // TODO add optional port setting
        var options = require("connect")().use(require("connect").static("./%build"));
        require("http").createServer(options).listen(3008).on("error", errorHandling);

    };


    module.exports.dashboardInit = function() {

	    var express = require("express");
	    var app = express();
	    var allPlugins = require("../lib/plugins").plugins();

	    app.configure(function(){
		    var dashboardFolder =  __dirname+"/../dashboard/";
		    app.use("/s/", express.static(dashboardFolder));
		    app.set("views", dashboardFolder);
		    app.engine("html", require("ejs").renderFile);
		    app.use(express.json());
		    app.use(express.urlencoded());
		    app.use(express.methodOverride());
		    app.use(app.router);
	    });

	    app.all("/", function(req, res) {
		    res.render("index.html", { allPlugins : allPlugins });
	    });

		app.use(express.logger("dev")).listen(3009);

    };


    function errorHandling(e){

        if (e.code==="EADDRINUSE") {
            require("../lib/echo")("port 3008 is already used", true);
        }

    }

