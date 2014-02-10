

    "use strict";


    var filesystem = require("fs");


    module.exports.init = function(){

        require("../all_files/export").init(function(allFiles){
            createCustomObject(allFiles);
        });

    };


    var createCustomObject = function(allFiles){

        saveToBuild({
            files : allFiles.files,
            folders : allFiles.folders
        });

    };


    var saveToBuild = function(allFiles){

        var rawData = JSON.stringify(allFiles);
        var pathForBlog = "./%build/assets/blogs.json";

        var fd = filesystem.openSync(pathForBlog, "w");
        filesystem.writeFileSync(pathForBlog, rawData);
        filesystem.closeSync(fd);

    };