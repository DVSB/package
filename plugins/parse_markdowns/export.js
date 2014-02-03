

    "use strict";


    var filesystem = require("fs");
    var underscore = require("underscore");
    underscore.mixin(require("underscore.string").exports());


    // load underscore with settings for mustaches
    underscore.templateSettings = {
        evaluate:    /\{\{#([\s\S]+?)\}\}/g, // {{# console.log("blah") }}
        interpolate: /\{\{[^#\{]([\s\S]+?)[^\}]\}\}/g, // {{ title }}
        escape:      /\{\{\{([\s\S]+?)\}\}\}/g, // {{{ <script> }}}
    };


    module.exports.init = function() {

	    require("./getMarkdowns")(function(allfiles, markdowns){
		    parseMarkdowns(allfiles, markdowns);
	    });

    };


    var parseMarkdowns = function(allFiles, markdowns) {

        var themeFiles = allFiles.theme;

        markdowns.forEach(function(scopeMdObj){

            // content of %THEME/current mustache formatted
            var currentTemplate = themeFiles[scopeMdObj.template];

            // create a copy and add some staff inside
            var localPluginsCopy = allFiles;

            // add for user also underscore
            localPluginsCopy._ = underscore;

            // send also all markdowns with content
            localPluginsCopy.markdowns = markdowns;

            // local content for access to "this"
            localPluginsCopy.local = scopeMdObj;

	        // send also all markdowns with content
	        localPluginsCopy.markdowns = localPluginsCopy;

            // if user defined nonexisting template, skip file
            if (!currentTemplate) {
	            var message = "> WARNING: file " +  scopeMdObj.originalpath + " has no definition of template! ";
	            message += "This file is proceeded without parsing.";
	            console.log(message); return;
            }

            // ready HTML with all necessary parsed objects
            var html = underscore.template(currentTemplate, localPluginsCopy);

            // new path so we know where to save it
            var originalPath = scopeMdObj.originalpath;
            var htmlPath = "%build"+originalPath.substr(0, originalPath.lastIndexOf(".md")) + ".html";

            // save to new position
            var fd = filesystem.openSync(htmlPath, 'w');
            filesystem.writeFileSync(htmlPath, html);
            filesystem.closeSync(fd);

        });

    };

    var parseMarkdownsTodo = function(allFiles, markdowns) {

	    var themeFiles = allFiles.theme;

	    markdowns.forEach(function(scopeMdObj){

		    // content of %THEME/current mustache formatted
		    var currentTemplate = themeFiles[scopeMdObj.template];

		    // create a copy and add some staff inside
		    var localPluginsCopy = allFiles;

		    // original path provides simple html extension
		    localPluginsCopy.htmlpath = scopeMdObj.originalpath.replace(".md", ".html");

		    // provide folder path and remove extension
		    localPluginsCopy.uripath = scopeMdObj.originalpath.replace(".md");

		    // if user defined nonexisting template, skip file
		    if (!currentTemplate) {
			    var message = "> WARNING: file " +  scopeMdObj.originalpath + " has no definition of template! ";
			    message += "This file is proceeded without parsing.";
			    console.log(message); return;
		    }

		    // ready HTML with all necessary parsed objects
		    var html = underscore.template(currentTemplate, {
			    local : localPluginsCopy,
			    _ : underscore,
			    underscore : underscore
		    });

		    // new path so we know where to save it
		    var originalPath = scopeMdObj.originalpath;
		    var htmlPath = "%build"+originalPath.substr(0, originalPath.lastIndexOf(".md")) + ".html";

		    // save to new position
		    var fd = filesystem.openSync(htmlPath, 'w');
		    filesystem.writeFileSync(htmlPath, html);
		    filesystem.closeSync(fd);

	    });

    };
