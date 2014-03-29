

    "use strict";


	/**
	 *  This is constructed always when user types `downpress` to the terminal
	 */
    var Downpress = function(){

		var that = this;

	    // inherit "this" from the class boilerplate (underscore, events..)
        require("../library/_Boilerplate").call(this);

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
				this.initReport(); break;

			case "help" :
				this.initHelp(); break;

			case "run" :
				this.initRun(); break;

			case "init" :
				this.initInit(); break;

			default :
				this.initWithoutArgument(); break;

		}

	};


	/**
	 *  Attach on website this, user can send also the personal data about his computer and OS and Node
	 */
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
	    process.kill();

    };


	/**
	 *  When user type `downpress help`, TODO should be implemented in next version for every command
	 */
    Downpress.prototype.initHelp = function(){

        this.log("help is gonna be implemented in version 0.3, sorry", true);
	    process.kill();

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


	/**
	 *  When user type `downpress init` and wants to create a new project boilerplate
	 */
    Downpress.prototype.initInit = function(){

        var that = this;
        var i = 0;

        function handleFolderErrors(err){

            if (err) {
                that.log("ERROR: folder "+ err.path + "already does exist!", true);
                process.kill();
            } else if (++i===9) {
	            that.whenAllInitFoldersAreCreated();
            }

        }

        this.fs.mkdir("./articles", handleFolderErrors);
	    this.fs.mkdir("./%templates", handleFolderErrors);
	    this.fs.mkdir("./%build", handleFolderErrors);
	    this.fs.mkdir("./page", handleFolderErrors);
	    this.fs.mkdir("./statics", handleFolderErrors);
	    this.fs.mkdir("./articles/1st", handleFolderErrors);
	    this.fs.mkdir("./articles/2nd", handleFolderErrors);
	    this.fs.mkdir("./articles/3rd", handleFolderErrors);
	    this.fs.mkdir("./articles/4th", handleFolderErrors);

	    // TODO
	    // maybe this can be created without files, just with some inteligent parameter
	    // something like ~ i want create this file also if the root directory doesn't exist

    };


	/**
	 *  On command `init` create also files, after directories are already created
	 */
    Downpress.prototype.whenAllInitFoldersAreCreated = function(){

        var i = 0;
	    var that = this;

        function handleFolderErrors(err){

            if (err) {
                that.log("file already exists: "+ err.path, true);
                process.kill();
            } else if (++i===13) {
	            that.log("success —- all files created successfully");
                that.log("type `downpress run` and open browser");
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

	    this.fs.appendFile("./readme.md", msg4, handleFolderErrors);
	    this.fs.appendFile("./%templates/index.html", msg.index, handleFolderErrors);
	    this.fs.appendFile("./%templates/page.html", msg1, handleFolderErrors);
	    this.fs.appendFile("./%templates/article.html", msg1, handleFolderErrors);
	    this.fs.appendFile("./%build/build-folder.md", msg5, handleFolderErrors);
	    this.fs.appendFile("./page/index.md", msg6, handleFolderErrors);
	    this.fs.appendFile("./articles/1st/index.md", msg2, handleFolderErrors);
	    this.fs.appendFile("./articles/2nd/index.md", msg2, handleFolderErrors);
	    this.fs.appendFile("./articles/3rd/index.md", msg2, handleFolderErrors);
	    this.fs.appendFile("./articles/4th/index.md", msg2, handleFolderErrors);
	    this.fs.appendFile("./statics/stylesheet.css", msg3, handleFolderErrors);
	    this.fs.appendFile("./statics/client.js", msg8, handleFolderErrors);
        this.fs.appendFile("./index.md", msg7, handleFolderErrors);

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

	    // TODO mkdir is synch operation because this is not happening everytime
	    // the relevant question ~ how to solve callbacks if are optional?

	    var FOLDER = "./" + global.downpress.config["dir-templates"];
	    var that = this;

	    function doesntExists(){
		    that.fs.mkdirSync(FOLDER);
		    that.log(FOLDER + " folder created to the root of a website", true);
	    }

	    this.fs.exists(FOLDER, function(exists){
		    if (!exists) { doesntExists(); }
	    });

    };


	/**
	 *  Create the server on localhost with an optional port (default 8088)
	 */
    Downpress.prototype.watchLocalhost = function(){

        var connect = require("connect");
	    var buildFolder = "./" + global.downpress.config["dir-build"];
        var options = connect().use(connect.static(buildFolder));

	    var server = require("http").createServer(options);

	    server.listen(8088);
	    server.on("error", (function(error){
		    this.portAlreadyExists(error);
	    }).bind(this));

    };


	/**
	 *  If port is already listening on something, report error to console
	 */
	Downpress.prototype.portAlreadyExists = function(error){

		var isAlreadyUsed = ("EADDRINUSE"===error.code);
		var usedPort = global.downpress.config["localhost-port"];

		if (isAlreadyUsed) {

			this.log("ERROR: port "+usedPort+" is already used by other process (maybe with downpress)", true);
			this.log("maybe your have downpress already run somewhere (??)", true);
			this.log("if you want to use more downpress ins. in one moment, change port in package.json", true);
			console.log();

		} else {

			this.log("TODO: this is unknown error of server creating", true);
			this.log("please report this, so we can handle this error", true);
			console.log(error);

		}

		process.kill();

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

    };


	/**
	 *  Choikar watches all folders with settings and on change runs Plugins.js
	 */
    Downpress.prototype.watchDirectories = function(){

	    var options = this.chokidarOptions();
	    var that = this;
        global.downpress.isGenerating = false;

        // initial build without any inital changes, just needs to be build
        global.downpress.isInitial = true;
        require("./Plugins")();

        // watch this folder with options, every 100ms regenerate whole folder
        require("chokidar").watch(".", options).on("all", function(event, path){
            that.onWatchingChangeChoikar(event, path);
        });

    };


	/**
	 *  Run on every change of Choikar in all directories
	 */
	Downpress.prototype.onWatchingChangeChoikar = function(event, path){

		var that = this;

		// TODO why the hell are on first time run "unlinkkDir ." 2x ?
		// shouldn't be even once

		global.downpress.lastChanged = { event : event, path : path };

        // what if next change is faster than folder is regenerated?
		if (!global.downpress.isGenerating) {
			that.log("`"+event+"` in `"+path +"`");
			require("./Plugins")();
		}

	};


	/**
	 *  Read package.json file from filesystem, this file is mandatory
	 */
    Downpress.prototype.packageJsonParsing = function(){

	    // package.json is a convention used in nodejs/grunt prjts
	    var FILE_NAME = "./package.json";
	    var that = this;

	    // read package from filesystem, check if is there
	    this.fs.readFile(FILE_NAME, function(error, data){
		    var parsedJsonFile = JSON.parse(data);
		    if (error) { that.errorOnPackageJsonRead(error); }
		    // TODO, add catching errors for unvalid JSON
		    that.successOnPackageJsonRead(parsedJsonFile);
	    });

	    // this is global object valid everywhere in application
	    global.downpress = {};

    };


	/**
	 *  When file package.json does exist
	 */
	Downpress.prototype.successOnPackageJsonRead = function(data){

		// if package.json file doens't contain downpress object, throw error
		var isDownpressPackage = data.downpress;
		if (!isDownpressPackage) { this.errorOnMissingDownpressInPackage(); }

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
		global.downpress.config["dir-build"] = data.downpress["dir-build"] || "%build";

		// interval of text files polling
		global.downpress.config["watch-interval"] = data.downpress["watch-interval"] || "50";
		global.downpress.config["watch-interval"] += "";

		// interval of text files polling
		global.downpress.config["watch-interval-binaries"] = data.downpress["watch-interval-binaries"] || "300";
		global.downpress.config["watch-interval-binaries"] += "";

		// delimiter of header in markdown files for meta data
		global.downpress.config["markdown-delimiter"] = data.downpress["markdown-delimiter"] || "---";

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
		if (!isNotExists) { return; }

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
	Downpress.prototype.errorOnMissingDownpressInPackage = function(){

		// log error message
		this.log("= ERROR", true);
		this.log("REASON: file package.json has no object downpress", true);
		this.log("SOLUTION: create in package.json 'downpress : {}' object", true);

		// kill process and finish the package run
		process.kill();

	};


    // run application

    new Downpress();
