

    "use strict";


    var scan = require("../mdls/scan/export");


    module.exports = function(){

	    scan.on("ready", function(){

		    downpress.scan = {};
		    downpress.scan.folders = this.folders;
		    downpress.scan.files = this.files;

			scannedProject();

	    });

	    scan.on("error", function(error){

		    throw error;

	    });

    };


    function scannedProject(){

	    // if it's generating, watching of files is disabled
	    downpress.isGenerating = true;

	    var statics, buildFolder, markdowns, templates, i=0;

	    buildFolder = require("../mdls/create_build/export");
	    buildFolder.on("ready", function(){ console.log("copied") });

	    return;

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

    }

