

    module.exports = function() {

        createBlankConfig();
        getIgnoredFilesAndFolders();
        getAllFiles();
        getAllFolders();
        filteredFolders();
        filteredFiles();

        return boilerplate;

    };


    var fs = require("fs");
    var SETTINGS_FOLDER = "../web/%settings/";
    var boilerplate;


    function getAllFilesFromFolder(dir) {

        var results = [];

        fs.readdirSync(dir).forEach(function(file) {

            file = dir+'/'+file;
            var stat = fs.statSync(file);

            if (stat && stat.isDirectory()) {
                results = results.concat(getAllFilesFromFolder(file))
            } else results.push(file);

        });

        return results;

    }


    function createBlankConfig() {

        boilerplate =  {
            ignoredfolders : [],
            ignoredfiles : [],
            allfiles : [],
            allfolders : [],
            filteredfiles : [],
            filteredfolders : []
        };

    }


    function getIgnoredFilesAndFolders() {

        var config;

        config = fs.readFileSync(SETTINGS_FOLDER+"generate.json")+"";
        config = JSON.parse(config);

        boilerplate.ignoredfolders = config.ignoredfolders;
        boilerplate.ignoredfiles = config.ignoredfiles;

    }


    function getAllFiles() {

        boilerplate.allfiles = getAllFilesFromFolder('../web');

    }


    function getAllFolders() {

        var allFiles = boilerplate.allfiles;
        var allFolderPaths = [];
        var foldersWithoutFiles = [];

        // cut everything after last slash
        allFiles.forEach(function(ele, i){
            allFolderPaths[i] = ele.slice(0, ele.lastIndexOf("/"));
        });

        // pass just if new folder to array
        allFolderPaths.forEach(function(ele, i){
            var isRepeated = allFolderPaths[i]!==allFolderPaths[i-1];
            if (isRepeated) foldersWithoutFiles.push(ele);
        });

        boilerplate.allfolders = foldersWithoutFiles;

    }


    function filteredFolders() {

        var allFolders = boilerplate.allfolders;
        var ignoredFolders = ["../web/%build", "../web/%settings", "../web/%theme"];
        var filteredFolders = [];

        allFolders.forEach(function(ele, i){
            var isIgnoredFolder = ignoredFolders.indexOf(ele)>-1;
            if (!isIgnoredFolder) filteredFolders.push(ele);
        });

        boilerplate.filteredfolders = filteredFolders;

    }


    function filteredFiles() {

        var filteredfolders = boilerplate.filteredfolders;
        var allfiles = boilerplate.allfiles;
        var ignoredfiles = boilerplate.ignoredfiles;
        var filteredfiles = [];

        // remove files in the ignored folders
        allfiles.forEach(function(ele, i){

            // is not in ingnored folder
            var currentFolder = ele.slice(0, ele.lastIndexOf("/"));
            var isNotInFilteredFolder = filteredfolders.indexOf(currentFolder)>-1;

            // is not ignored file after last slash
            var isNotIgnoredFile = ele.substr(ele.lastIndexOf("/")+1);
            isNotIgnoredFile = ignoredfiles.indexOf(isNotIgnoredFile)===-1;

            // go ahead
            if (isNotInFilteredFolder&&isNotIgnoredFile) filteredfiles.push(ele);

        });

        boilerplate.filteredfiles = filteredfiles;

    }