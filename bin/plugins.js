

    "use strict";


    /**
     *   All generating should have just three steps
     *      1; copy all files to BUILD folder
     *      2; find markdowns, statics, templates, anything ..
     *      3; generating
     *      4; after generating
     */


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

        // if it's generating, watching of files is disabled
        this.generatingTime = +new Date();
        global.downpress.isGenerating = true;

	    // creates a build folder and copy all files there
        require("../mdls/Build_Create").on("ready", function(){
            that.buildCopied();
        });

    };


    /**
     *  When the build folder is copied as is to new directory from a website root
     */
    Plugins.prototype.buildCopied = function(){

        var that = this;
        var i = 0;

	    this.on("built", function(){
            i++;
	        return; // TODO
            if (i===3) { that.exportToFileSystem(); }
        });

	    // global.downpress.statics
        require("../mdls/Statics").on("ready", function(){
            that.emit("built");
        });

	    // global.downpress.templates
	    require("../mdls/Templates").on("ready", function(){
		    that.emit("built");
	    });

	    // global.downpress.markdowns
        require("../mdls/Markdowns").on("ready", function(){
		    that.emit("built");
	    });



    };


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


    Plugins.prototype.finishedGenerating = function(){

        var generatingTime = (+new Date()) - this.generatingTime;
        this.log("regenerated in " + generatingTime + "ms");

    };


    module.exports = new Plugins();
