

    "use strict";



    var Plugins = function(){


        require("../library/boilerplate/class").call(this);

        var that = this;
        var scan = require("../mdls/scan/export");

        scan.on("ready", function(){

            global.downpress.scan = {};
            global.downpress.scan.folders = this.folders;
            global.downpress.scan.files = this.files;

            that.scannedProject();

        });

        scan.on("error", function(error){

            throw error;

        });


    };


    require("util").inherits(Plugins, require("../library/boilerplate/class"));


    Plugins.prototype.scannedProject = function(){

        var scan = require("../mdls/scan/export");

        // if it's generating, watching of files is disabled
        downpress.isGenerating = true;

        var statics, buildFolder, markdowns, templates, i=0;

        buildFolder = require("../mdls/create_build/export");
        buildFolder.on("ready", function(){ console.log("copied") });

        /*

        require("../mdls/create_build/export").CreateBuildDirectory(function(){
            i++; if (i===5) onEndCallback();
        });

        require("../mdls/statics/export")(function(_statics){
            statics = _statics;
            i++; if (i===5) onEndCallback();
        });

        require("../mdls/markdowns/export")(function(_markdowns){
            markdowns = _markdowns;
            i++; if (i===5) onEndCallback();
        });

        require("../mdls/templates/export")(function(_templates){
            templates = _templates;
            i++; if (i===5) onEndCallback();
        });

        function onEndCallback(){

            require("../mdls/generate/export")(statics, markdowns, templates, underscore);

            require("../mdls/sitemaps/export")(function(){
                //console.log("sitemap");
            });

            require("../mdls/offline_manifest/export")(function(){
                //console.log("offline manifest");
            });

        }

        */

    };


    module.exports = new Plugins();