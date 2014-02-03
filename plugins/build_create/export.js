

    "use strict";


    var filesystem = require("fs");
    var ignoredFolders = ["%build", "%plugins", "%settings", "%theme", ".git", ".svn"];


    module.exports.init = function(globalCallback) {

        removeBuildDir("./%build");
        createBuildDir("./%build");

	    copyUserFiles(function(){
            globalCallback();
	    });

    };


    module.exports.version = function() {

        return "1.0.1";

    };


    var removeBuildDir = function(path) {

	    // recursively remove whole build folder with all sub-folders

	    // TODO add asych and faster version
	    // TODO test on windows and linux if removing works well

        var files = [];

        if ( filesystem.existsSync(path) ) {

            files = filesystem.readdirSync(path);

            files.forEach(function(file){
                var curPath = path + "/" + file;
                if(filesystem.statSync(curPath).isDirectory()) {
                    removeBuildDir(curPath);
                } else {
                    filesystem.unlinkSync(curPath);
                }
            });

            filesystem.rmdirSync(path);

        }

    };


    var createBuildDir = function(folder) {

	    // create a new empty build folder to user website root

        filesystem.mkdirSync(folder);

    };


    var copyUserFiles = function(callback) {

	    // grab every file and copy to destination folder

	    var allFiles = _getAllFilesFromFolder(".");
	    var filteredFiles = _removeIgnoredFolders(allFiles);
	    var fse = require('fs-extra');
	    var callbackReady = 0;

	    var smallCallback = function(){
		    if (callbackReady===filteredFiles.length-1) { callback();
		    } else { callbackReady++; }
	    };

	    filteredFiles.forEach(function(actualPath){
		    var targetPath = "./%build" + actualPath.substr(1, actualPath.length);
		    fse.copy(actualPath, targetPath, smallCallback);
	    });

    };


    var _getAllFilesFromFolder = function(dir) {

	    // scan recursively a whole folder for all files and return array

	    var allFiles = [];

	    filesystem.readdirSync(dir).forEach(function(file) {

		    file = dir + '/' + file;
		    var stat = filesystem.statSync(file);

		    if (stat && stat.isDirectory()) {
			    allFiles = allFiles.concat(_getAllFilesFromFolder(file));
		    } else allFiles.push(file);

	    });

	    return allFiles;

    };


    var _removeIgnoredFolders = function(allFiles) {

	    // filter all unnecessary folders and files from array

	    // TODO check also others system files, not just .DS_store
	    // add option of ignored staff to config file

	    var filesQuantity = allFiles.length;

	    while (filesQuantity>0) {

		    --filesQuantity;

		    var current = allFiles[filesQuantity];
		    var currentTopFolder = current.split("./")[1].split("/")[0];

			var shouldBeIgnored = ignoredFolders.indexOf(currentTopFolder)!==-1;
		    var isDsStore = current.indexOf(".DS_Store")!==-1;

		    if (shouldBeIgnored || isDsStore) allFiles.splice(filesQuantity, 1);

	    }

	    return allFiles;

    };

