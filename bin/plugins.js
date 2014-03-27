

    "use strict";


    /**
     *  Plugins is run on every change in a website folder
     */
    var Plugins = function(){

        require("../library/_Boilerplate").call(this);

    };


    require("util").inherits(Plugins, require("../library/_Boilerplate"));


    /**
     *  Create the build folder with all files as is in normal folders
     */
    Plugins.prototype.regenerate = function(){

        this.createTempFolder();

    };


    /**
     *  Create the build folder with all files as is in normal folders
     */
    Plugins.prototype.createTempFolder = function(){

        var that = this;
        var module;

        // if it's generating, watching of files is disabled
        this.generatingTime = +new Date();
        global.downpress.isGenerating = true;


        // creates a build folder and copy all files there
        module = require("../mdls/Build_Create")();
        module.on("ready", function(){

            that.buildCopied();
        });

    };


    /**
     *  When the build folder is copied as is to new directory from a website root
     */
    Plugins.prototype.buildCopied = function(){

        var that = this;
        var i = 0;
        var module;

        this.on("built", function(){
            i++;
            if (i===3) { that.exportToFileSystem(); }
        });

        // global.downpress.statics
        module = require("../mdls/Statics")();
        module.on("ready", function(){
            that.emit("built");
	    });

        return;

	    // global.downpress.templates
        module = require("../mdls/Templates")();
        module.on("ready", function(){
		    that.emit("built");
	    });

	    // global.downpress.markdowns
        module = require("../mdls/Markdowns")();
        module.on("ready", function(){
		    that.emit("built");
	    });

    };


    /**
     *  Create all necessary objects which are accessible also on the screen
     */
    Plugins.prototype.exportToFileSystem = function(){

        var that = this;
        var i = 0;


        this.on("exporting", function(){
            i++;
            if (i===3) { that.finishedGenerating(); }
        });

        require("../mdls/Generate").on("ready", function(){
            that.emit("exporting");
        });

        require("../mdls/Sitemap").on("ready", function(){
            that.emit("exporting");
        });

        require("../mdls/OfflineManifest").on("ready", function(){
            that.emit("exporting");
        });

    };


    /**
     *
     */
    Plugins.prototype.finishedGenerating = function(){

        var generatingTime = (+new Date()) - this.generatingTime;
        this.log("regenerated in " + generatingTime + "ms");

	    // generating is finished
	    global.downpress.isGenerating = false;

    };


    module.exports = function(){
        console.error("!!!!!! sss");


        var plugins = new Plugins();

        plugins.regenerate();

    };
