

    "use strict";


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

        var allFiles = require("./lib-cobweb")().files;
        var onlyMarkdowns = [];
        var filesystem = require("fs");

        allFiles.forEach(function(ele){
            if (ele.indexOf(".md")>-1) {
                onlyMarkdowns.push(ele);
            }
        });

        onlyMarkdowns.forEach(function(mdPah){

            var currentMdObj = require("./md-read")(mdPah);
            var html = require("./md-compile")(currentMdObj);
            var UNDERS = require("./lib-underscore");

            var newPath = "%build"+mdPah.substr(1);
            var positionOfMd = newPath.lastIndexOf(".md");
            newPath = UNDERS(newPath).splice(positionOfMd, 3, '.html');

            var fd = filesystem.openSync(newPath, 'w');
            filesystem.writeFileSync(newPath, html);
            filesystem.closeSync(fd);

        });

    };


    module.exports.assets = function() {

        var allFiles = require("./lib-cobweb")().files;
        var noMarkdowns = [];
        var filesystem = require("fs");

        allFiles.forEach(function(ele){
            if (ele.indexOf(".md")===-1) {
                noMarkdowns.push(ele);
            }
        });

        noMarkdowns.forEach(function(path){


            var newPath = "%build"+path.substr(1);

            // copy file from one place to another
            filesystem.createReadStream(path).pipe(
                filesystem.createWriteStream(newPath)
            );

        });

    };