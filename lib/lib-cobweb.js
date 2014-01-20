

    "use strict";


    var underscore = require("./lib-underscore");


    module.exports = function() {

        return {
            settings : getSettingsFiles(),
            theme : getThemeFiles(),
            folders : getFilteredFolders(),
            files : getFilteredFiles(),
            markdowns : getAllMarkdowns()
        };

    };


    var getFilteredFolders = function() {

        var allFolders = _getAllFoldres(".");

        var ignoredStrings = _getIgnoredConfig().ignored;
        ignoredStrings.push("/%settings", "/%build", "/%theme");

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


    var getAllMarkdowns = function(){

        var allMarkdowns = [];
        var allFiles = getFilteredFiles();

        // filter to only files which are markdowns
        allFiles.forEach(function(ele){

            if (ele.indexOf(".md")>-1) {
                allMarkdowns.push(ele);
            }

        });

        // create massive object
        allMarkdowns.forEach(function(currentMd, i){

            allMarkdowns[i] = {};

            // get file name like index.html
            var lastSlashPos = currentMd.substr(1).lastIndexOf("/");
            allMarkdowns[i]._filename = currentMd.substr(lastSlashPos+2);
            allMarkdowns[i]._filename = allMarkdowns[i]._filename.replace(".md", ".html");

            // add new path of html file
            allMarkdowns[i]._fullpath = currentMd.substr(1, lastSlashPos+1);
            if (allMarkdowns[i]._fullpath==="") allMarkdowns[i]._fullpath = "/";

            // add content from real md file with user content
            underscore.extend(allMarkdowns[i], require("./md-read")(currentMd));

            // compile content of user
            // allMarkdowns[i]._content = require("./md-compile")(allMarkdowns[i]._content);

        });

        return allMarkdowns;

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


    var _getAllFoldres = function(dir) {

        var filesystem = require("fs");
        var results = [];

        filesystem.readdirSync(dir).forEach(function(file) {

            file = dir+'/'+file;
            var stat = filesystem.statSync(file);

            if (stat && stat.isDirectory()) {
                results.push(file);
                results = results.concat(_getAllFoldres(file))
            }

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