

    "use strict";


    /**
     *  Plugins is run on every change in a website folder
     */
    var Plugins = function(){

        require("../library/_Boilerplate").call(this);

        this.scannedProject();

    };


    require("util").inherits(Plugins, require("../library/_Boilerplate"));


    /**
     *  Create the build folder with all files as is in normal folders
     */
    Plugins.prototype.scannedProject = function(){

        var that = this;

        // if it's generating, watching of files is disabled
        this.generatingTime = +new Date();
        global.downpress.isGenerating = true;

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
            if (i===3) { that.exportToFileSystem(); }
        });

        require("../mdls/Statics").on("ready", function(){
            that.emit("built");
        });

        require("../mdls/Markdowns").on("ready", function(){
            that.emit("built");
        });

        require("../mdls/Templates").on("ready", function(){
            that.emit("built");
        });

    };


    Plugins.prototype.exportToFileSystem = function(){

        var that = this;
        var i = 0;

        this.on("exporting", function(){
            i++;
            if (i===3) { that.finishedGenerating(); }
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