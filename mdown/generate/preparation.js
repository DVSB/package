var fs = require("fs");
var SETTINGS_FOLDER = "../web/_settings/";
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
    var ignoredFolders = boilerplate.ignoredfolders;
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
        var nowfile = ele;
        var isNotIgnoredFile = filteredfolders.indexOf(currentFolder)>-1;
        var isNotIgnoredFile = ignoredfiles.indexOf(nowfile)===-1;

        // go ahead
        if (isNotInFilteredFolder) filteredfiles.push(ele);

    });


    var i = allfiles.length-1;
    while (i>0) {
        var nowfile = allfiles[i];
        nowfile = nowfile.substr(nowfile.lastIndexOf("/")+1);
        var isNotIgnoredFile = ignoredfiles.indexOf(nowfile)===-1;
        if (isNotIgnoredFile) { filteredfiles.push(nowfile) }
        i--;
    }


    console.log(filteredfiles);

}


module.exports = function(req, res) {

    createBlankConfig();
    getIgnoredFilesAndFolders();
    getAllFiles();
    getAllFolders();
    filteredFolders();
    filteredFiles();

    // console.log(boilerplate);
    // fs.writeFileSync(SETTINGS_FOLDER+"_generating.json", JSON.stringify(boilerplate));

};