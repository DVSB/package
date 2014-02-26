

    "use strict";


    module.exports = function(callback) {

        var SCANNED_FOLDER = ".";

        var allFiles = _getAllFilesFromFolder(SCANNED_FOLDER);
        var filteredFiles = _removeIgnoredFiles(allFiles);
        var parsedFiles = _parseToFileObjects(filteredFiles);

        callback(parsedFiles);

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

    var _removeIgnoredFiles = function(arr) {

        function isNotIgnored(fileName){
            var isNotSystemFile = fileName.indexOf("/.")<=-1;
            var isNotLibraryFile = fileName.indexOf("/%")<=-1;
            return isNotSystemFile && isNotLibraryFile;
        }

        return arr.filter(isNotIgnored);

    };


    var _parseToFileObjects = function(files) {

        var filesystem = require("fs");
        var newObj = [];

        var getRandom = function(){
            var random1 = Math.floor((Math.random()*800000)+100000);
            var random2 = Math.floor((Math.random()*800000)+100000);
            var random3 = Math.floor((Math.random()*800000)+100000);
            return(random1+random2+random3).toString(36);
        };

        files.forEach(function(file, i){

            var stats = filesystem.statSync(file);

            newObj[i] = {};
            newObj[i]._name = file.substr(file.lastIndexOf("/")+1);
            newObj[i]._extension = file.substr(file.lastIndexOf(".")+1);
            newObj[i]._size = stats.size;
            newObj[i]._path = file;
            newObj[i]._uniqid = getRandom();

        });

        return newObj;

    };