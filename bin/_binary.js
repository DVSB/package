#!/usr/bin/env node


    "use strict";

	/**
	 *  This is constructed always when user types `downpress` to the terminal
	 */
    var Downpress = function(){

	    // inherit "this" from the class boilerplate (underscore, events..)
        require("../library/_Boilerplate").call(this);

		var that = this;

	    // if is not a valid package, break software
        this.packageJsonParsing();

		// after package.json is parsed successfully
		this.on("package-parsed", function(){
			that.parseSecondConsoleArgument();
		});

    };


    require("util").inherits(Downpress, require("../library/_Boilerplate"));


	/**
	 *  Parsing second argument typed to console (like `downpress run`)
	 */
	Downpress.prototype.parseSecondConsoleArgument = function(){

		// user types in the console also a second parameter
		var consoleArgument = process.argv[2];

		switch (consoleArgument) {

			case "report" :
				this.initReport();  break;

			case "help" :
				this.initHelp(); break;

			case "run" :
				this.initRun(); break;

			case "init" :
				this.initInit(); break;

			default :
				this.initWithoutArgument(); break;

		}

	}


    Downpress.prototype.initReport = function(){

        console.log("");
        this.log("report a bug?");
        this.log("  1: browse website github.com/downpress/package/issues");
        this.log("  2: copy below infos about your computer and go ahead!");

        console.log("");
        this.log("versions:");
        this.log("  node: " + process.versions.node);
        this.log("  http_parser: " + process.versions.http_parser);
        this.log("  v8: " + process.versions.v8);
        this.log("  ares: " + process.versions.ares);
        this.log("  uv: " + process.versions.uv);
        this.log("  zlib: " + process.versions.zlib);
        this.log("  modules: " + process.versions.modules);
        this.log("  openssl: " + process.versions.openssl);

        console.log("");
        this.log("details:");
        this.log("  arch: " + process.arch);
        this.log("  platform: " + process.platform);
        this.log("  argv: " + process.argv);
        this.log("  env.PWD: " + process.env.PWD);
        this.log("  env.OLDPWD: " + process.env.OLDPWD);
        this.log("  env._: " + process.env._);
        this.log("  pid: " + process.pid);
        this.log("  features.debug: " + process.features.debug);
        this.log("  features.ipv6: " + process.features.ipv6);
        this.log("  version openssl: " + process.versions.openssl);

        console.log("");

    };


    Downpress.prototype.initHelp = function(){

        this.log("help is gonna be implemented in version 0.3, sorry");

    };

	/**
	 *  When user type `downpress run` and package.json does exist in root of project
	 */
    Downpress.prototype.initRun = function(){

	    var port = global.downpress.config["localhost-port"];

        console.log();
        this.log("browse http://localhost:" + port + " for a build preview");
        this.log("watching "+process.env.PWD);

        this.createTemplatesFolder();
        this.watchLocalhost();
        this.watchDirectories();

    };


    Downpress.prototype.initInit = function(){

        var that = this;
        var filesystem = require("fs");
        var i = 0;

        function handleFolderErrors(err){
            if (err) {
                console.log("error -- folder already exists: "+ err.path, true);
                process.kill();
            }
            if (++i===9) that.initOnReady();
        }

        filesystem.mkdir("./articles", handleFolderErrors);
        filesystem.mkdir("./%templates", handleFolderErrors);
        filesystem.mkdir("./%build", handleFolderErrors);
        filesystem.mkdir("./page", handleFolderErrors);
        filesystem.mkdir("./statics", handleFolderErrors);
        filesystem.mkdir("./articles/1st", handleFolderErrors);
        filesystem.mkdir("./articles/2nd", handleFolderErrors);
        filesystem.mkdir("./articles/3rd", handleFolderErrors);
        filesystem.mkdir("./articles/4th", handleFolderErrors);

    };


    Downpress.prototype.initOnReady = function(){

        var i = 0;
        var filesystem = require("fs");

        function handleFolderErrors(err){
            if (err) {
                log("file already exists: "+ err.path, true);
                process.kill();
            }
            if (++i===13) {
                log("success —- all files created successfully");
                log("type \"downpress run\" and open browser");
            }
        }

        var msg = {};

        var msg1 = "<!-- in this file use classic html -->\n{{ local._content }}";
        var msg2 = "--\ntemplate : article\n---\n\n**hello, i am content of articles!**";
        var msg7 = "--\ntemplate : index\n---\n\n**hello, i am in /index.md!**";
        var msg6 = "--\ntemplate : page\n---\n\n**hello, i am in /page/index.md**";
        var msg4 = "if you will not use '---' meta tags in MD,\nfile is copied only and not parsed";
        var msg3 = "html { background: #ccc }";
        var msg8 = "console.log('hello');";
        var msg5 = "all content in this folder will be removed!! and replaced with build";

        msg.index = "\n\t{{ local._content }}<br>\n";
        msg.index += "\n\t<script src=\"/statics/client.js\"></script>\n";
        msg.index += "\n\t<link href=\"statics/stylesheet.css\" rel=\"stylesheet\" /><br>\n";
        msg.index += "\t<a href=\"/articles/1st/\">1st blog</a><br/>\n";
        msg.index += "\t<a href=\"/articles/2nd/\">2nd blog</a><br/>\n";
        msg.index += "\t<a href=\"/articles/3rd/\">3rd blog</a><br/>\n";
        msg.index += "\t<a href=\"/articles/4th/\">4th blog</a><br/>\n";
        msg.index += "\t<a href=\"/page/\">page</a><br/>\n";

        filesystem.appendFile("./readme.md", msg4, handleFolderErrors);
        filesystem.appendFile("./%templates/index.html", msg.index, handleFolderErrors);
        filesystem.appendFile("./%templates/page.html", msg1, handleFolderErrors);
        filesystem.appendFile("./%templates/article.html", msg1, handleFolderErrors);
        filesystem.appendFile("./%build/build-folder.md", msg5, handleFolderErrors);
        filesystem.appendFile("./page/index.md", msg6, handleFolderErrors);
        filesystem.appendFile("./articles/1st/index.md", msg2, handleFolderErrors);
        filesystem.appendFile("./articles/2nd/index.md", msg2, handleFolderErrors);
        filesystem.appendFile("./articles/3rd/index.md", msg2, handleFolderErrors);
        filesystem.appendFile("./articles/4th/index.md", msg2, handleFolderErrors);
        filesystem.appendFile("./statics/stylesheet.css", msg3, handleFolderErrors);
        filesystem.appendFile("./statics/client.js", msg8, handleFolderErrors);
        filesystem.appendFile("./index.md", msg7, handleFolderErrors);

    };

	/**
	 *  When Downpress is run without a valid argument (second - `downpress something`)
	 */
    Downpress.prototype.initWithoutArgument = function(){

	    this.log("ERROR -- use only subcommands: `run`, `init` or `report`", true);
	    this.log("downpress killed", true);
	    process.kill();

    };


	/**
	 *  Check if %Templates folder does exist, if no - create a new one, if yes - nothing
	 */
    Downpress.prototype.createTemplatesFolder = function(){

	    // todo
	    // mkdir is synch operation because this is not happening everytime
	    // the relevant question ~ how to solve callbacks if are optional?

	    var FOLDER = "./" + global.downpress.config["dir-templates"];
	    var that = this;

	    function doesntExists(){
		    that.fs.mkdirSync(FOLDER);
		    that.log(FOLDER + " folder created to root", true);
	    }

	    this.fs.exists(FOLDER, function(exists){
		    if (!exists) doesntExists();
	    });

    };

	/**
	 *  Create the server on localhost with an optional port (default 8088)
	 */
    Downpress.prototype.watchLocalhost = function(){

        var connect = require("connect");

        function errorHandling(e){
            if (e.code==="EADDRINUSE") {
                this.log("error -- port 8088 is already used by other process", true);
                console.log();
                process.kill();
            } else {
                console.log("TODO");
                console.log(e);
            }
        }

        var options = connect().use(connect.static("./%build"));
        require("http").createServer(options).listen(8088).on("error", errorHandling);

    };

	/**
	 *  Chokidar options for watcher of folders, what should be watched, in which interval
	 */
    Downpress.prototype.chokidarOptions = function(){

	    return {
		    ignored : global.downpress.config["watch-ignored"],
		    persistent : false,
		    interval : global.downpress.config["watch-interval"],
		    binaryInterval : global.downpress.config["watch-interval-binaries"],
		    ignoreInitial : true
	    };

    }

	/**
	 *  Choikar watches all folders with settings and on change runs Plugins.js
	 */
    Downpress.prototype.watchDirectories = function(){

        // initial build without any inital changes, just needs to be build
        require("./Plugins");

        // watch this folder with options, every 100ms regenerate whole folder
	    var options = this.chokidarOptions();
	    var that = this;
        require("chokidar").watch("./", options).on("all", that.onWatchingChangeChoikar);

    };


	/**
	 *  Run on every change of Choikar in all directories
	 */
	Downpress.prototype.onWatchingChangeChoikar = function(event, path){

		// TODO why the hell are on first time run "unlinkkDir ." 2x ?
		// shouldn't be even once

		// TODO
		// this can be used later for detection, what actually should be regenerated
		// if is changed something in templates - only markdowns should be replaced
		// if is changed something in binary, only that binary should be replaced
		// if is changed something inside file, only this file should be regenerated
		global.downpress.lastChanged = { event : event, path : path };

		var that = this;

		// what if next change is faster than folder is regenerated?
		if (!global.downpress.isGenerating) {
			that.log("on `"+event+"` in `"+path +"`");
			require("./Plugins");
		}

	};


	/**
	 *  Read package.json file from filesystem, this file is mandatory
	 */
    Downpress.prototype.packageJsonParsing = function(){

	    // this is global object valid everywhere in application
	    global.downpress = {};

	    // package.json is a convention used in nodejs/grunt prjts
	    var FILE_NAME = "./package.json";
	    var that = this;

	    // read package from filesystem, check if is there
	    var rawPackage = this.fs.readFile(FILE_NAME, function(error, data){
		    if (error) that.errorOnPackageJsonRead(error);
			var parsedJsonFile = JSON.parse(data);
		    // TODO, add catching errors for unvalid JSON
		    that.successOnPackageJsonRead(parsedJsonFile);
	    });

    };


	/**
	 *  When file package.json does exist
	 */
	Downpress.prototype.successOnPackageJsonRead = function(data){

		// if package.json file doens't contain downpress object, throw error
		var isDownpressPackage = data.downpress;
		if (!isDownpressPackage) this.errorOnMissingDownpressInPackage();

		// we can access to whole package.json file via package object
		global.downpress.package = data;

		// or we can access to downpress object directly and edit it)
		global.downpress.config = data.downpress;

		// if port is not defined, set default to 8088
		global.downpress.config["localhost-port"] = data.downpress["localhost-port"] || "8088";
		global.downpress.config["localhost-port"] += ""; // sanitate in case of a number

		// check existing name of templates folder
		global.downpress.config["dir-templates"] = data.downpress["dir-templates"] || "%templates";

		// check existing name of build folder
		global.downpress.config["dir-build"] = data.downpress["dir-build"] || "%templates";

		// interval of text files polling
		global.downpress.config["watch-interval"] = data.downpress["watch-interval"] || "50";
		global.downpress.config["watch-interval"] += "";

		// interval of text files polling
		global.downpress.config["watch-interval-binaries"] = data.downpress["watch-interval-binaries"] || "300";
		global.downpress.config["watch-interval-binaries"] += "";

		// interval of text files polling
		// TODO, this needs to be implemented, as regexp or function or array
		global.downpress.config["watch-ignored"] = /%build/;

		// package.json exists and is parsed successfully
		this.emit("package-parsed");

	};

	/**
	 *  When file package.json doesn't exists in root of project (when DP is run)
	 */
	Downpress.prototype.errorOnPackageJsonRead = function(error){

		var isNotExists = error.code = "ENOENT";
		if (!isNotExists) return;

		// log error message
		this.log("= ERROR", true);
		this.log("REASON: file package.json doesn't exists in project", true);
		this.log("SOLUTION: create file package.json in your root", true);

		// kill process and finish the package run
		process.kill();

	};


	/**
	 *  When we have a package.json file, but inside is missing required "downpress" object
	 */
	Downpress.prototype.errorOnMissingDownpressInPackage = function(error){

		// log error message
		this.log("= ERROR", true);
		this.log("REASON: file package.json has no object downpress", true);
		this.log("SOLUTION: create in package.json 'downpress : {}' object", true);

		// kill process and finish the package run
		process.kill();

	};


    // run application

    new Downpress();
