

    "use strict";



    var Plugins = function(){

        require("../library/_Boilerplate").call(this);

        this.scannedProject();

    };


    require("util").inherits(Plugins, require("../library/_Boilerplate"));


    Plugins.prototype.scannedProject = function(){

        // if it's generating, watching of files is disabled
        global.downpress.isGenerating = true;
        this.generatingTime = +new Date();

        require("../mdls/Build_Create").on("ready", (function(){
            this.buildCopied();
        }).bind(this));

    };


    Plugins.prototype.buildCopied = function(){

        var that = this;
        var i = 0;

        this.on("built", function(){
            i++;
            if (i===3) that.exportToFileSystem();
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
            if (i===3) that.finishedGenerating();
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
