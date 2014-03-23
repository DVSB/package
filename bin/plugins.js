

    "use strict";



    var Plugins = function(){

        require("../library/boilerplate/class").call(this);

        this.scannedProject();

    };


    require("util").inherits(Plugins, require("../library/boilerplate/class"));


    Plugins.prototype.scannedProject = function(){

        // if it's generating, watching of files is disabled
        downpress.isGenerating = true;

        var statics, buildFolder, markdowns, templates, i=0;

        require("../mdls/Build_Create").on("ready", (function(){
            this.buildCopied();
        }).bind(this));

    };

    Plugins.prototype.buildCopied = function(){

        var statics = require("../mdls/Statics");

        statics.ready("tess", function(ss){
            console.log("hello samko tess");
            console.log(ss);
        });

        /*

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