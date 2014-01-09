

    module.exports = function() {

        return {
            watchFolder : _watchFolder,
            getFiles : _getFiles,
            getFolders : _getFolders
        };

    };


    var filesystem = require("fs");


    var _getFiles = function(dir) {

        var results = [];

        filesystem.readdirSync(dir).forEach(function(file) {

            file = dir+'/'+file;
            var stat = filesystem.statSync(file);

            if (stat && stat.isDirectory()) {
                results = results.concat(_getFiles(file))
            } else results.push(file);

        });

        return results;

    };


    var _getFolders = function(dir) {

        var allFiles = _getFiles(dir);

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


    var _watchFolder = function(target){

        // for this we need to implement external library
        // this is peace of shit

        var allFolders = _getFolders(target);
        allFolders.forEach(forEachOne);

        function forEachOne(ele){
            filesystem.watch(ele, watchMe);
        }

        function watchMe(event, filename){
            console.log( { filename : filename, event : event } );
        }

    };