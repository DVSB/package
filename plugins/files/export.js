

    "use strict";


    var underscore = require("underscore");
    var filesystem = require("fs");
    var ignoredStrings = ["/%build", "/%theme", "/%plugins"];


    module.exports.init = function() {

        return {
            theme : getThemeFiles(),
            folders : getFilteredFolders(),
            files : getFilteredFiles()
        };

    };


    var getFilteredFolders = function() {

        var allFolders = _getAllFolders(".");

        // pick all files which should be removed from array
        var toBeRemoved = [];
        allFolders.forEach(function(currentFolder){
            ignoredStrings.forEach(function(ignoredString){
                var shouldBeRemoved = currentFolder.indexOf(ignoredString)>-1;
                if (shouldBeRemoved) toBeRemoved.push(currentFolder);
            });
        });

        allFolders = underscore.difference(allFolders, toBeRemoved);

        return allFolders;

    };


    var getFilteredFiles = function(){

        var allFiles = _getAllFilesFromFolder(".");

        // pick all files which should be removed from array
        var toBeRemoved = [];
        allFiles.forEach(function(currentFile){
            ignoredStrings.forEach(function(ignoredString){
                var shouldBeRemoved = currentFile.indexOf(ignoredString)>-1;
                if (shouldBeRemoved) toBeRemoved.push(currentFile);
            });
        });

        allFiles = underscore.difference(allFiles, toBeRemoved);

        allFiles.forEach(function(currentFile, i){
            allFiles[i] = currentFile.substr(1);
        });

        return allFiles;

    };


    var getThemeFiles = function(){

        var themeFiles = _getAllFilesFromFolder("./%theme/");
        var filesystem = require("fs");
        var newThemeObj = {};

        themeFiles.forEach(function(ele, i){
            var themeFile = filesystem.readFileSync(ele)+"";
            var name = ele.slice(ele.lastIndexOf("/")+1).split(".html")[0];
            var isNotFuckingDsStore = name!==".DS_Store";
            if (isNotFuckingDsStore) newThemeObj[name] = themeFile;
        });

        return newThemeObj;

    };


    var _getAllFilesFromFolder = function(dir) {

        var filesystem = require("fs");
        var results = [];

        filesystem.readdirSync(dir).forEach(function(file) {

            file = dir+'/'+file;
            var stat = filesystem.statSync(file);

            if (stat && stat.isDirectory()) {
                results = results.concat(_getAllFilesFromFolder(file))
            } else results.push(file);

        });

        return results;

    };


    var _getAllFolders = function(dir) {

        var results = [];

        filesystem.readdirSync(dir).forEach(function(file) {

            file = dir+'/'+file;
            var stat = filesystem.statSync(file);

            if (stat && stat.isDirectory()) {
                results.push(file);
                results = results.concat(_getAllFolders(file))
            }

        });

        return results;

    };
