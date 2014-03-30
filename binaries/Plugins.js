

    "use strict";


    /**
     *  Plugins is run on every change in a website folder
     */
    var Plugins = function(){

        require("../library/_Boilerplate").call(this);
        this.createTempFolder();

    };


    require("util").inherits(Plugins, require("../library/_Boilerplate"));



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
        var module;


        this.on("exporting", function(){
            i++;
            if (i===3) { that.finishedGenerating();  }
        });

        module = require("../mdls/Generate")();
        module.on("ready", function(){
            that.emit("exporting");
        });

        module = require("../mdls/Sitemap")();
        module.on("ready", function(){
            that.emit("exporting");
        });

        module = require("../mdls/OfflineManifest")();
        module.on("ready", function(){
            that.emit("exporting");
        });

    };


    /**
     *  This should be run just first time on downpress.isInit
     */
    Plugins.prototype.finishedGenerating = function(){

        if (global.downpress.isInitial) {
            var generatingTime = (+new Date()) - this.generatingTime;
            this.log("regenerated in " + generatingTime + "ms");
        }

	    // generating is finished
	    global.downpress.isGenerating = false;
        global.downpress.isInitial = false;

    };


    module.exports = function(){

        new Plugins();

    };
