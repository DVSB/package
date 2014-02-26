

    "use strict";


    module.exports = function(callback) {

        var SCANNED_FOLDER = ".";

        var allFiles = _getAllFilesFromFolder(SCANNED_FOLDER);
        var themeFiles = _keepOnlyThemeFolder(allFiles);
        var templatesContent = _readContentOfAllThemeFiles(themeFiles);

        callback(templatesContent);

    };


    var _getAllFilesFromFolder = function(dir) {

        // TODO this needs to be async

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


    var _keepOnlyThemeFolder = function(arr) {

        function isNotIgnored(fileName){
            var isThemeFolder = fileName.indexOf("./%templates/")!==-1;
            return isThemeFolder;
        }

        return arr.filter(isNotIgnored);

    };


    var _readContentOfAllThemeFiles = function(themeFiles) {

        var filesystem = require("fs");
        var newThemeObj = {};

        themeFiles.forEach(function(ele){
            var themeFile = filesystem.readFileSync(ele)+"";
            var name = ele.slice(ele.lastIndexOf("/")+1).split(".html")[0];
            var isNotFuckingDsStore = name!==".DS_Store";
            if (isNotFuckingDsStore) newThemeObj[name] = themeFile;
        });

        return newThemeObj;

    };