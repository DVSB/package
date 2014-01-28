

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
        return;
        copyStaticAssets();

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

        var sortedFolders = plugins.all_files.folders.sort();

        // TODO interesting bug
        // if remove / add folder first item in sortedFolders is "blog"
        // but if run first time app, it's a "./"
        // find out why instead of this creepy solution
        if (sortedFolders[0]===".") {
            sortedFolders.shift();
            console.log("PICOVINAAAA ---- KEDY SA TOTO DEJE --- VOBEC NIEKEDY?? ------- ");
        }

        sortedFolders.forEach(function(folder){
            // create from "./blog/some" => "./%build/blog/some"
            filesystem.mkdirSync("./%build"+folder.substr(1));
        });

    };


    var parseMarkdowns = function() {

        var allFiles = plugins.all_files;

        // just compile all of them
        allFiles.markdowns.forEach(function(scopeMdObj){

            // everytime should be "local" different
            allFiles.local = scopeMdObj;

            // content of %THEME/current mustache formatted
            var currentTemplate = allFiles.theme[allFiles.local.template];

            // add for user also underscore
            allFiles._ = underscore;

            // if user defined nonexisting template, skip file
            if (!currentTemplate) {
                var message = "file "+scopeMdObj.filename+" has wrong layout: "+scopeMdObj.template;
                console.log(message);
                return;
            }

            // ready HTML with all necessary parsed objects
            var html = underscore.template(currentTemplate, allFiles);

            // new path so we know where to save it
            var newPath = "%build/"+scopeMdObj._fullpath+scopeMdObj._filename;

            // save to new position
            var fd = filesystem.openSync(newPath, 'w');
            filesystem.writeFileSync(newPath, html);
            filesystem.closeSync(fd);

        });

    };


    var copyStaticAssets = function() {

        var allFiles = plugins.all_files.files;
        var staticFiles = [];

        allFiles.forEach(function(ele){
            if (ele.indexOf(".md")===-1) {
                staticFiles.push(ele);
            }
        });

        staticFiles.forEach(function(path){

            // create a new path for copying assets
            var newPath = "./%build/"+path.substr(1);

            // copy file from one place to another
            filesystem.createReadStream("."+path).pipe(
                filesystem.createWriteStream(newPath)
            );

        });

    };


