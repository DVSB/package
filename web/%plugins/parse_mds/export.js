

    "use strict";


    var filesystem = require("fs");
    var plugins = {};

    // load underscore with settings for mustaches
    var underscore = require("underscore");
    underscore.mixin(require("underscore.string").exports());
    underscore.templateSettings = {
        evaluate:    /\{\{#([\s\S]+?)\}\}/g, // {{# console.log("blah") }}
        interpolate: /\{\{[^#\{]([\s\S]+?)[^\}]\}\}/g, // {{ title }}
        escape:      /\{\{\{([\s\S]+?)\}\}\}/g, // {{{ <script> }}}
    };


    module.exports.init = function(allPlugins) {

        plugins = allPlugins;

        removeBuildDir("./%build");
        createBuildDir();

        createEmptyFolders();
        parseMarkdowns();

    };


    var removeBuildDir = function(path) {

        var files = [];

        if ( filesystem.existsSync(path) ) {

            files = filesystem.readdirSync(path);

            files.forEach(function(file){
                var curPath = path + "/" + file;
                if(filesystem.statSync(curPath).isDirectory()) {
                    removeBuildDir(curPath);
                } else {
                    filesystem.unlinkSync(curPath);
                }
            });

            filesystem.rmdirSync(path);

        }

    };


    var createBuildDir = function() {

        filesystem.mkdirSync("./%build");

    };


    var createEmptyFolders = function() {

        var sortedFolders = plugins.files.folders.sort();

        sortedFolders.forEach(function(folder){
            // create from "./blog/some" => "./%build/blog/some"
            filesystem.mkdirSync("./%build"+folder.substr(1));
        });

    };


    var parseMarkdowns = function() {

        var localPluginsCopy = plugins;

        // just compile all of them
        localPluginsCopy.markdowns.forEach(function(scopeMdObj){

            // content of %THEME/current mustache formatted
            var currentTemplate = localPluginsCopy.files.theme[scopeMdObj.template];

            // add for user also underscore
            localPluginsCopy._ = underscore;

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
            var originalPath = scopeMdObj._originalpath;
            var htmlPath = "%build"+originalPath.substr(0, originalPath.lastIndexOf(".md")) + ".html";

            // save to new position
            var fd = filesystem.openSync(htmlPath, 'w');
            filesystem.writeFileSync(htmlPath, html);
            filesystem.closeSync(fd);

        });

    };

