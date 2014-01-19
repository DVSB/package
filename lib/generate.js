

    "use strict";


    var UNDERS = require("./lib-underscore");


    module.exports.builddir = function() {

        var filesystem = require("fs");
        filesystem.mkdirSync("%build");

    };


    module.exports.folders = function() {

        var sortedFolders = require("./lib-cobweb")().folders.sort();
        var filesystem = require("fs");

        // TODO interesting bug
        // if remove / add folder first item in sortedFolders is "blog"
        // but if run first time app, it's a "./"
        // find out why instead of this creepy solution
        if (sortedFolders[0]===".") sortedFolders.shift();

        sortedFolders.forEach(function(folder){
            // create from "./blog/some" => "./%build/blog/some"
            filesystem.mkdirSync("./%build"+folder.substr(1));
        });

    };


    module.exports.markdowns = function() {

        var allFiles = require("./lib-cobweb")();
        var filesystem = require("fs");

        // just compile all of them
        allFiles.markdowns.forEach(function(scopeMdObj){

            // everytime should be "local" different
            allFiles.local = scopeMdObj;

            // content of %THEME/current mustache formatted
            var currentTemplate = allFiles.theme[allFiles.local.template];

            // ready HTML with all necessary parsed objects
            var html = UNDERS.template(currentTemplate, allFiles);

            // new path so we know where to save it
            var newPath = "%build"+scopeMdObj._fullpath+scopeMdObj._filename;

            console.log(newPath, "is gonna be saved");

            // save to new position
            var fd = filesystem.openSync(newPath, 'w');
            filesystem.writeFileSync(newPath, html);
            filesystem.closeSync(fd);

        });

    };


    module.exports.assets = function() {

        var allFiles = require("./lib-cobweb")().files;
        var staticFiles = [];
        var filesystem = require("fs");

        allFiles.forEach(function(ele){
            if (ele.indexOf(".md")===-1) {
                staticFiles.push(ele);
            }
        });

        staticFiles.forEach(function(path){

            // create a new path for copying assets
            var newPath = "%build"+path.substr(1);

            // copy file from one place to another
            filesystem.createReadStream(path).pipe(
                filesystem.createWriteStream(newPath)
            );

        });

    };
