

    "use strict";


    var filesystem = require("fs");


    // load underscore with settings for mustaches
    var underscore = require("underscore");
    underscore.mixin(require("underscore.string").exports());
    underscore.templateSettings = {
        evaluate:    /\{\{#([\s\S]+?)\}\}/g, // {{# console.log("blah") }}
        interpolate: /\{\{[^#\{]([\s\S]+?)[^\}]\}\}/g, // {{ title }}
        escape:      /\{\{\{([\s\S]+?)\}\}\}/g, // {{{ <script> }}}
    };



    module.exports.getVersion = function() {

        return "1.0.1";

    };


    module.exports.getDependeces = function() {

        return {
            "all_files" : "1.1.0",
            "markdowns" : "1.1.0"
        };

    };


    module.exports.init = function() {

        var _allFiles;
        var _markdowns;
        var onReadyCount = 0;

        var onReady = function(){
            ++onReadyCount;
            if (onReadyCount===2) parseMarkdowns(_allFiles, _markdowns);
        };

        require("../all_files/export").init(function(allFiles){
            _allFiles = allFiles;
            onReady();
        });

        require("../markdowns/export").init(function(markdowns){
            _markdowns = markdowns;
            onReady();
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

            // if user defined nonexisting template, skip file
            if (!currentTemplate) {
                var message = "file "+scopeMdObj.filename+" has wrong layout: "+scopeMdObj.template;
                console.log(message);
                return;
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

