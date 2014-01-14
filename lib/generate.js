

    "use strict";


    var COWEB = require("./lib-cobweb")();
    var UNDERS = require("./lib-underscore");


    module.exports.builddir = function() {

        var filesystem = require("fs");
        filesystem.mkdirSync("%build");

        console.log("%build created successfuly");

    };


    module.exports.folders = function() {

        var sortedFolders = COWEB.folders.sort();
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

        console.log("generate markdowns done");

    };


    module.exports.assets = function() {

        console.log("copy assets done");

    };

