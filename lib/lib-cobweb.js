

    "use strict";


    var underscore = require("./lib-underscore");


    module.exports = function() {

        return {
            settings : getSettingsFiles(),
            theme : getThemeFiles(),
            folders : getFilteredFolders(),
            files : getFilteredFiles()
        };

    };


    var getFilteredFolders = function() {

        var allFolders = getFilteredFiles();

        // TODO
        // this algorithm should be improved because it's not detecing
        // empty folders, because getFilteredFiles dont get empty folders
        // after its impossible to detect folders in watching chokidar

        // cut whole string after last slash (after the file name)
        allFolders.forEach(function(ele, i){
            allFolders[i] = ele.slice(0, ele.lastIndexOf("/"));
        });

        // remove all repeated items (in case of more files in one folder)
        allFolders = underscore.uniq(allFolders);

        return allFolders;

    };


    var getFilteredFiles = function(){

        var allFiles = _getAllFilesFromFolder(".");


        var ignoredStrings = _getIgnoredConfig().ignored;
        ignoredStrings.push("/%settings/", "/%build/", "/%theme/");

        // pick all files which should be removed from array
        var toBeRemoved = [];
        allFiles.forEach(function(currentFile){
            ignoredStrings.forEach(function(ignoredString){
                var shouldBeRemoved = currentFile.indexOf(ignoredString)>-1;
                if (shouldBeRemoved) toBeRemoved.push(currentFile);
            });
        });

        allFiles = underscore.difference(allFiles, toBeRemoved);

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


    var getSettingsFiles = function(){

        var settingsFiles = _getAllFilesFromFolder("./%settings/");
        var filesystem = require("fs");
        var newSettingsObject = {};

        settingsFiles.forEach(function(ele){
            var jsonFile = filesystem.readFileSync(ele);
            var name = ele.slice(ele.lastIndexOf("/")+1).split(".json")[0];
            var isNotFuckingDsStore = name!==".DS_Store";
            if (isNotFuckingDsStore) newSettingsObject[name] = JSON.parse(jsonFile);
        });

        return newSettingsObject;

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


    var _getIgnoredConfig = function() {

        var config;

        config = require("fs").readFileSync("./%settings/generate.json");
        config += "";
        config = JSON.parse(config);

        return config;

    };