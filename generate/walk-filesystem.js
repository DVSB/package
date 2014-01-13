

    module.exports = function() {

        return {
            getFiles : getFiles,
            getFolders : getFolders
        };

    };


    var filesystem = require("fs");
    var ignoredfiles = ['.DS_Store'];


    var getFiles = function(dir) {

        var results = [];

        filesystem.readdirSync(dir).forEach(function(file) {

            file = dir+'/'+file;
            var stat = filesystem.statSync(file);

            if (stat && stat.isDirectory()) {
                results = results.concat(getFiles(file))
            } else results.push(file);

        });

        results = _filterFiles(results, ignoredfiles);

        return results;

    };


    var getFolders = function(dir) {

        var allFiles = getFiles(dir);

        // Cut everything after a last slash
        allFiles.forEach(function(ele, i){
            allFiles[i] = ele.slice(0, ele.lastIndexOf("/"));
        });

        // Remove all duplicates
        allFiles = _getUniqItemsFromArray(allFiles);

        return allFiles;

    };


    var _getUniqItemsFromArray = function(array){

        var temp = {};
        var uniqueArray = [];

        for (var i = 0; i < array.length; i++) {
            temp[array[i]] = true;
        }

        for (var k in temp) {
            uniqueArray.push(k);
        }

        return uniqueArray;

    };


    var _filterFiles = function(files, ignored) {

        var filteredFiles = [];

        files.forEach(function(ele){

            var isNotIgnoredFile = ele.substr(ele.lastIndexOf("/")+1);
            isNotIgnoredFile = ignored.indexOf(isNotIgnoredFile)===-1;

            if (isNotIgnoredFile) filteredFiles.push(ele);

        });

       return filteredFiles;

    };
