

    "use strict";


    var Templates = function() {

        require("./_Boilerplate").call(this);

        var SCANNED_FOLDER = ".";

        var allFiles = this.getAllFilesFromFolder(SCANNED_FOLDER);
        var themeFiles = this.keepOnlyThemeFolder(allFiles);
        var templatesContent = this.readContentOfAllThemeFiles(themeFiles);

        // DONE

        global.downpress.templates = templatesContent;

        setTimeout((function(){
            this.emit("ready")
        }).bind(this), 1);

    };


    require("util").inherits(Templates, require("./_Boilerplate"));


    Templates.prototype.getAllFilesFromFolder = function(dir) {

        // TODO this needs to be async

        var filesystem = require("fs");
        var results = [];
        var that = this;

        filesystem.readdirSync(dir).forEach(function(file) {

            file = dir+'/'+file;
            var stat = filesystem.statSync(file);

            if (stat && stat.isDirectory()) {
                results = results.concat(that.getAllFilesFromFolder(file))
            } else results.push(file);

        });

        return results;

    };


    Templates.prototype.keepOnlyThemeFolder = function(arr) {

        function isNotIgnored(fileName){
            var isThemeFolder = fileName.indexOf("./%templates/")!==-1;
            return isThemeFolder;
        }

        return arr.filter(isNotIgnored);

    };


    Templates.prototype.readContentOfAllThemeFiles = function(themeFiles) {

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


    module.exports = new Templates();

