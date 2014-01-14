

    module.exports = function() {

        return require("fs").readdirSync("./");

        /*

        return {
            settings : getSettingsFiles(),
            theme : getThemeFiles(),
            folders : getFilteredFolders(),
            files : getFilteredFiles()
        };

        */

    };


    var USER_FOLDER = "../web";


    var getFilteredFolders = function() {

        var allFolders = getFilteredFiles();

        // cut whole string after last slash (after the file name)
        allFolders.forEach(function(ele, i){
            allFolders[i] = ele.slice(0, ele.lastIndexOf("/"));
        });

        // remove all repeated items (in case of more files in one folder)
        allFolders = underscore.uniq(allFolders);

        return allFolders;

    };


    var getFilteredFiles = function(){

        var allFiles = _getAllFilesFromFolder(USER_FOLDER);

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

        var themeFiles = _getAllFilesFromFolder(USER_FOLDER + "/%theme/");
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

        var settingsFiles = _getAllFilesFromFolder(USER_FOLDER + "/%settings/");
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
        var GENERATE_SETTING = USER_FOLDER+"/%settings/generate.json";

        config = require("fs").readFileSync(GENERATE_SETTING);

        config += "";
        config = JSON.parse(config);

        return config;

    };
