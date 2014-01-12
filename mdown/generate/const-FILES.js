

    module.exports = function() {

        return {
            // settings : getAllFiles(),
            // theme : getAllFiles(),
            folders : getFilteredFolders(),
            files : getFilteredFiles()
        };

    };


    var USER_FOLDER = "../web";


    var getFilteredFolders = function() {

        var allFolders = _getAllFilesFromFolder(USER_FOLDER);
        var ignoredFolders = _getIgnoredConfig().ignoredfolders;

        // cut whole string after last slash (after the file name)
        allFolders.forEach(function(ele, i){
            allFolders[i] = ele.slice(0, ele.lastIndexOf("/"));
        });

        // remove all repeated items (in case of more files in one folder)
        allFolders = underscore.uniq(allFolders);

        // remove folder if it's in the system folder
        var systemFolders = ["%build", "%settings", "%theme"];
        var filteredFolders = [];
        allFolders.forEach(function(ele){
            var currentFolder = ele.slice(ele.lastIndexOf("/")+1);
            var isIgnoredFolder = systemFolders.indexOf(currentFolder)>-1;
            if (!isIgnoredFolder) filteredFolders.push(ele);
        });

        return filteredFolders;

    };


    var getFilteredFiles = function(){

        var filteredFolders = getFilteredFolders();
        var allFiles = _getAllFilesFromFolder(USER_FOLDER);
        var ignoredFile = _getIgnoredConfig().ignoredfiles;

        // DRY remove file if is not in filtered folder (=> is ignored)
        var filteredFiles = [];
        allFiles.forEach(function(ele, i){
            var currentFolder = ele.slice(0, ele.lastIndexOf("/"));
            var isNotInFilteredFolder = filteredFolders.indexOf(currentFolder)>-1;
            if (isNotInFilteredFolder) filteredFiles.push(ele);
        });

        // remove all ignored files defined in the user configuration
        var moreFilteredFiles = [];
        filteredFiles.forEach(function(ele){
            var currentFile = ele.substr(ele.lastIndexOf("/")+1);
            var isIgnoredFile = ignoredFile.indexOf(currentFile)>-1;
            if (!isIgnoredFile) moreFilteredFiles.push(ele);
        });

        return moreFilteredFiles;

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
