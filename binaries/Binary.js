#!/usr/bin/env node


    "use strict";


	/**
	 *  constructor of application; should contains all listeners "ON" from the whole file
	 */
    var Downpress = function(){

		var that = this;

		// this is global object valid everywhere in application
		global.downpress = {};

	    // inherit "this" from the class boilerplate (underscore, events, filesystem..)
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
	 *  Read and parse package.json file from the file system; this file is mandatory for Downpress
	 */
	Downpress.prototype.packageJsonParsing = function(){

		// package.json is a convention used in nodejs/grunt prjts
		var FILE_NAME = "./package.json";
		var that = this;

		// read package from filesystem, check if is there
		this.fs.readFile(FILE_NAME, function(error, data){

			// handling all kind of errors
			if (error) {
				that.errorOnPackageRead(error);
			}

			// on wrong syntax in package.json
			try {
				var parsedJsonFile = JSON.parse(data);
			} catch(error) {
				that.errorOnPackageSyntaxError(error);
			}

			// if everythingk was ok, go here
			that.successOnPackageJsonRead(parsedJsonFile);

		});

	};


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
	 *  Choikar watches all folders with settings and on change runs Plugins.js
	 */
    Downpress.prototype.watchDirectories = function(){

	    var gazeWatchingPlugin = require("gaze");
	    var that = this;
        global.downpress.isGenerating = false;

        // initial build without any inital changes, just needs to be build
        global.downpress.isInitial = true;
        require("./Plugins")();

	    // when changed package.json should be refreshed all downpress
	    gazeWatchingPlugin("**/package.json", function(err) {
		    if (err) { throw err; }
		    this.on("all", (that.onChanged._packagejson).bind(that));
	    });

	    //
	    gazeWatchingPlugin("%templates/*.html", function(err) {
		    if (err) { throw err; }
		    this.on("all", (that.onChanged._templatefile).bind(that));
	    });

	    //
	    gazeWatchingPlugin("**/*.md", function(err) {
		    if (err) { throw err; }
		    this.on("all", (that.onChanged._markdownfile).bind(that));
	    });

	    //
	    var extensionsOfImages = that.getStaticFilesExtensions();
	    gazeWatchingPlugin(extensionsOfImages, function(err) {
		    if (err) { throw err; }
		    this.on("all", (that.onChanged._staticfile).bind(that));
	    });

	    // TODO
	    // if any other file, just do everything and copy 1:1 -- the slowest way

    };



	/**
	 * If external plugin GAZE will find any change in website, regenerate specific part of the project
	 */
	Downpress.prototype.onChanged = {


		/**
		 *  Return if given path is in the build directory of our website
		 */
		"_isInBuildFolder" : function(path){

			var BUILD_DIR = "/" + global.downpress.config["dir-build"] + "/";

			if (path.indexOf(BUILD_DIR)!==-1) { 
				return;
			}

		},


		/**
		 *  Is just now regenerating already? (prevent the start of next generating before first was finished so far)
		 */
		"_isGeneratingJustNow" : function(){

			return 	global.downpress.isGenerating;

		},


		/**
		 *  Log a change to the console so user knows, if Downpress detected the change on the file system
		 */
		"_logDetectedChanged" : function(event, path){

			this.log("regenerated on " + event + " in " + path);

		},


		/**
		 *  If in package.json was detected any change by GAZE
		 */
		"_packagejson" : function(event, path){

			// generating takes some time; if is already generating, ignore the event
			var isGeneratingAlready = this.onChanged._isGeneratingJustNow();
			if (isGeneratingAlready) { return; }

			// log change
			this.log("package.json was changed; whole website was regenerated");

			// regenerate everything
			// TODO later regenerated only relevant part of the website
			require("./Plugins")();

		},


		/**
		 *  If in any markdown was detected any change by GAZE
		 */
		"_markdownfile" : function(event, path){

			// generating takes some time; if is already generating, ignore the event
			var isGeneratingAlready = this.onChanged._isGeneratingJustNow();
			if (isGeneratingAlready) { return; }

			// log change
			this.onChanged._logDetectedChanged(event, path);

			// regenerate everything
			// TODO later regenerated only relevant part of the website
			require("./Plugins")();

		},


		/**
		 *  If in any static file (png, jpg, mp3..) was detected any change by GAZE
		 */
		"_staticfile" : function(event, path){

			// generating takes some time; if is already generating, ignore the event
			var isGeneratingAlready = this.onChanged._isGeneratingJustNow();
			if (isGeneratingAlready) { return; }

			// log change
			this.onChanged._logDetectedChanged(event, path);

			// regenerate everything
			// TODO later regenerated only relevant part of the website
			require("./Plugins")();

		},


		/**
		 *  If in any template file (%template/*.html) was detected any change by GAZE
		 */
		"_templatefile" : function(event, path){

			// generating takes some time; if is already generating, ignore the event
			var isGeneratingAlready = this.onChanged._isGeneratingJustNow();
			if (isGeneratingAlready) { return; }

			// log change
			this.onChanged._logDetectedChanged(event, path);

			// regenerate everything
			// TODO later regenerated only relevant part of the website
			require("./Plugins")();

		}


	};


	/**
	 *  Return all extensions of "static files"
	 */
	Downpress.prototype.getStaticFilesExtensions = function(){

		return [
			"**/*.jpeg",
			"**/*.jpg",
			"**/*.exif",
			"**/*.raw",
			"**/*.gif",
			"**/*.png",
			"**/*.bmp",
			"**/*.webp",
			"**/*.psd",
			"**/*.mp3",
			"**/*.mpeg",
			"**/*.avi"
		];

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
	 *  When file `package.json` doesn't exists in a root of the project (when Downpress is run)
	 */
	Downpress.prototype.errorOnPackageRead = function(error){

		var isNotExists = (error.code === "ENOENT");

		// unhandled and unknown error; TODO maybe some permissions errors?
		if (!isNotExists) {
			this.log("Unknown error while reading of package.json, please report this", true);
			process.kill();
		}

		this.log("Error:", true);
		this.log("  Reason: File `package.json` doesn't exist in the project!", true);
		this.log("  Solution: Create file `package.json` in the root. Or read Docs.", true);

		process.kill();

	};


	/**
	 *  When file `package.json` exists, but has wrong syntax inside and isn't possible to parse it
	 */
	Downpress.prototype.errorOnPackageSyntaxError = function(error){

		this.log("Error:", true);
		this.log("  Reason: File `package.json` has wrong unvalid syntax", true);
		this.log("  Solution: Check if syntax in `package.json` in project is really valid", true);

		process.kill();

	};


	/**
	 *  When we have a package.json file, but inside is missing required "downpress" object
	 */
	Downpress.prototype.errorOnMissingDownpressInPackage = function(){

		// log error message
		this.log("ERROR", true);
		this.log("  reason: file package.json has no object downpress", true);
		this.log("  solution: create in package.json 'downpress : {}' object", true);

		// kill process and finish the package run
		process.kill();

	};


	/**
	 *  The application Downpress is constructed on typed `downpress` to the console
	 */
    new Downpress();
