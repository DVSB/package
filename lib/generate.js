

    "use strict";


    var filesystem = require("fs");


    var removeBuildDir = function(path) {

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


    var createBuildDir = function() {

        filesystem.mkdirSync("%build");

    };


    var createEmptyFolders = function() {

        var sortedFolders = require("./user_files")().folders.sort();

        // TODO interesting bug
        // if remove / add folder first item in sortedFolders is "blog"
        // but if run first time app, it's a "./"
        // find out why instead of this creepy solution
        if (sortedFolders[0]===".") {
            sortedFolders.shift();
            console.log("PICOVINAAAA ---- KEDY SA TOTO DEJE --- VOBEC NIEKEDY??");
        }

        sortedFolders.forEach(function(folder){
            // create from "./blog/some" => "./%build/blog/some"
            filesystem.mkdirSync("./%build"+folder.substr(1));
        });

    };


    var parseMarkdowns = function() {

        var allFiles = require("./user_files")();
        var underscore = require("./lib-underscore");

        // just compile all of them
        allFiles.markdowns.forEach(function(scopeMdObj){

            // everytime should be "local" different
            allFiles.local = scopeMdObj;

            // content of %THEME/current mustache formatted
            var currentTemplate = allFiles.theme[allFiles.local.template];

            // add for user also underscore
            allFiles._ = underscore;

            // if user defined nonexisting template, skip file
            if (!currentTemplate) {
                require("./echo")("e0002", scopeMdObj.filename, scopeMdObj.template);
                return;
                // if has wrong layout, skip this tag
            }

            // ready HTML with all necessary parsed objects
            var html = underscore.template(currentTemplate, allFiles);

            // new path so we know where to save it
            var newPath = "%build/"+scopeMdObj._fullpath+scopeMdObj._filename;

            // save to new position
            var fd = filesystem.openSync(newPath, 'w');
            filesystem.writeFileSync(newPath, html);
            filesystem.closeSync(fd);

        });

    };


    var copyStaticAssets = function() {

        var allFiles = require("./user_files")().files;
        var staticFiles = [];

        allFiles.forEach(function(ele){
            if (ele.indexOf(".md")===-1) {
                staticFiles.push(ele);
            }
        });

        staticFiles.forEach(function(path){

            // create a new path for copying assets
            var newPath = "./%build/"+path.substr(1);

            // copy file from one place to another
            filesystem.createReadStream("."+path).pipe(
                filesystem.createWriteStream(newPath)
            );

        });

    };


    removeBuildDir("./%build");
    createBuildDir();

    createEmptyFolders();
    parseMarkdowns();
    copyStaticAssets();