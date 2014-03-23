

    "use strict";


    var filesystem = require("fs");


    // load underscore with settings for mustaches


    var ignoredStrings = ["/%", "/."];

    var Markdowns = function() {

        require("./_Boilerplate").call(this);

        // require("./allFiles").init(function(allFiles){
        //    callback(getAllMarkdownsObjects(allFiles));
        // });

        this.getAllMarkdownsObjects({
            theme : this.getThemeFiles(),
            folders : this.getFilteredFolders(),
            files : this.getFilteredFiles()
        });

    };


    require("util").inherits(Markdowns, require("./_Boilerplate"));


    Markdowns.prototype.getThemeFiles = function(){

        var themeFiles = this.getAllFilesFromFolder("./%templates/");
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


    Markdowns.prototype.getAllFilesFromFolder = function(dir) {

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


    Markdowns.prototype.getFilteredFolders = function() {

        var allFolders = this.getAllFolders(".");
        var ignoredStrings = ["/%", "/."];

        // pick all files which should be removed from array
        var toBeRemoved = [];
        allFolders.forEach(function(currentFolder){
            ignoredStrings.forEach(function(ignoredString){
                var shouldBeRemoved = currentFolder.indexOf(ignoredString)>-1;
                if (shouldBeRemoved) toBeRemoved.push(currentFolder);
            });
        });

        allFolders = this.underscore.difference(allFolders, toBeRemoved);

        return allFolders;

    };


    Markdowns.prototype.getAllFolders = function(dir) {

        var results = [];
        var that = this;

        filesystem.readdirSync(dir).forEach(function(file) {

            file = dir+'/'+file;
            var stat = filesystem.statSync(file);

            if (stat && stat.isDirectory()) {
                results.push(file);
                results = results.concat(that.getAllFolders(file))
            }

        });

        return results;

    };


    Markdowns.prototype.getFilteredFiles = function(){

        var allFiles = this.getAllFilesFromFolder(".");
        var ignoredStrings = ["/%", "/."];

        // pick all files which should be removed from array
        var toBeRemoved = [];
        allFiles.forEach(function(currentFile){
            ignoredStrings.forEach(function(ignoredString){
                var shouldBeRemoved = currentFile.indexOf(ignoredString)>-1;
                var isDsStore = currentFile.indexOf(".DS_Store")!==-1;
                if (shouldBeRemoved || isDsStore) toBeRemoved.push(currentFile);
            });
        });

        allFiles = this.underscore.difference(allFiles, toBeRemoved);

        allFiles.forEach(function(currentFile, i){
            allFiles[i] = currentFile.substr(1);
        });

        return allFiles;

    };


    Markdowns.prototype.getAllMarkdownsObjects = function(allFiles){

        // get only markdowns, filter by containing of ".md" string
        // TODO should be improved = only if .md is on the end
        // TODO not it detects also if md is in middle

        var metaTags = [];
        var allMarkdowns = [];
        var files = allFiles.files;

        files.forEach(function(file){

            if (file.indexOf(".md")>-1) allMarkdowns.push(file);

        });

        // parse all markdowns and get nice huge object of markdowns

        allMarkdowns.forEach((function(markdownPath){

            var markdownArticle = this.readFileByPath(markdownPath);
            var markdownBody = this.getBody(markdownArticle);
            var markdownHeaderObj = this.getHeaderObj(markdownArticle);

            // new API
            var getRandom = function(){
                var random1 = Math.floor((Math.random()*800000)+100000);
                var random2 = Math.floor((Math.random()*800000)+100000);
                var random3 = Math.floor((Math.random()*800000)+100000);
                return(random1+random2+random3).toString(36);
            };

            markdownHeaderObj._path = markdownPath.substr(0, markdownPath.lastIndexOf("/")+1);
            markdownHeaderObj._origin = markdownPath;
            markdownHeaderObj._target = markdownPath.replace(".md", ".html");
            markdownHeaderObj._uniqid = getRandom();
            markdownHeaderObj._content = require("marked")(markdownBody);

            metaTags.push(markdownHeaderObj);

        }).bind(this));


        // DONE

        global.downpress.markdowns = metaTags;

        setTimeout((function(){
            this.emit("ready")
        }).bind(this), 1);

    };


    Markdowns.prototype.readFileByPath = function(path) {

        var filesystem = require("fs");

        var template;
        template = filesystem.readFileSync("."+path);
        template += "";

        return template;

    };


    Markdowns.prototype.getHeaderObj = function(markdown) {

        var croppedByNewLineArr = markdown.split(/\n/);
        var delimiterPosition = croppedByNewLineArr.indexOf("---", 1);
        var markdownHeader = croppedByNewLineArr.slice(1, delimiterPosition);
        var markdownHeaders = {};

        markdownHeader.forEach((function(ele){

            var titleOfHeaderItem = ele.substr(0, ele.indexOf(":"));
            var valueOfHeaderItem = ele.substr(ele.indexOf(":")+1);

            // remove start or end or multiple whitespaces
            titleOfHeaderItem = this.underscore.clean(titleOfHeaderItem);
            valueOfHeaderItem = this.underscore.clean(valueOfHeaderItem);

            markdownHeaders[titleOfHeaderItem] = valueOfHeaderItem;

        }).bind(this));

        return markdownHeaders;

    };


    Markdowns.prototype.getBody = function(markdown) {

        var croppedByNewLineArr = markdown.split(/\n/);
        var delimiterPosition = croppedByNewLineArr.indexOf("---", 1)+1;
        var markdownBody = croppedByNewLineArr.slice(delimiterPosition);

        markdownBody = markdownBody.join("\n");

        return markdownBody;

    };


    module.exports = new Markdowns();

