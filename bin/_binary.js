#!/usr/bin/env node


    "use strict";


    var Application = function(){

        require("../library/boilerplate/class").call(this);

        global.downpress = {};
        this.parsePackageJson();

        var consoleArgument = process.argv[2];
        switch (consoleArgument) {

            case "report" :
                this.initReport();
                break;

            case "help" :
                this.initHelp();
                break;

            case "run" :
                this.initRun();
                break;

            case "init" :
                this.initInit(); // well, this is the worst name of the func. TODO
                break;

            default :
                this.initWithoutArgument();
                break;

        }

    };


    require("util").inherits(Application, require("../library/boilerplate/class"));


    Application.prototype.initReport = function(){

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


    Application.prototype.initHelp = function(){

        this.log("help is gonna be implemented in version 0.3, sorry");

    };


    Application.prototype.initRun = function(){

        console.log();
        this.log("browse http://localhost::8088 for a build preview");
        this.log("watching "+process.env.PWD);
        console.log();

        this.checkIfIsDownpressDir();
        this.watchLocalhost();
        this.watchInitialization();

    };


    Application.prototype.initInit = function(){

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


    Application.prototype.initOnReady = function(){

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


    Application.prototype.initWithoutArgument = function(){

        this.log("error -- use only subcommand: `run`, `init` or `report`", true);

    };


    Application.prototype.checkIfIsDownpressDir = function(){

        var isExistsTemplates = require("fs").existsSync('./%templates/');

        if (!isExistsTemplates) {
            this.log("ERROR (more on downpress.org/start)", true);
            this.log("missing `%templates` folder!", true);
            this.log("you can download a boilerplate, or use `downpress init`", true);
            console.log();
            process.kill();
        }

    };


    Application.prototype.watchLocalhost = function(){

        // TODO add optional port setting

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


    Application.prototype.chokidarOptions = function(){


        return {
            ignored : /%build/,
            persistent : true,
            interval : 300,
            ignoreInitial : true
        };


    };


    Application.prototype.watchInitialization = function(){

        var options = this.chokidarOptions();
        var that = this;

        // initial build
        require("./Plugins");

        // watch this folder with options, every 100ms regenerate whole folder
        require("chokidar").watch("./", options).on("all", function(event, path){

            downpress.lastChanged = { event : event, path : path };

            // what if next change is faster than folder is regenerated?
            if (!global.downpress.isGenerating) {
                that.log("on `"+event+"` in `"+path +"`");
                require("./Plugins");
            }

        });

    };


    Application.prototype.parsePackageJson = function(){

        global.downpress.config = require("fs").readFileSync("./package.json");
        global.downpress.config = JSON.parse(global.downpress.config);

        if (!global.downpress.config.version) {
            global.downpress.config.version = "0.0.3";
        }

    };


    // run application

    new Application();