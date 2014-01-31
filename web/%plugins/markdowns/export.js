

    "use strict";


    // normal require of underscore for nodejs
    var underscore = require("underscore");
    underscore.mixin(require("underscore.string").exports());



    module.exports.init = function(allPlugins) {

        var metaTags = [];

        // get only markdowns, filter by containing of ".md" string
        // TODO should be improved = only if .md is on the end
        // TODO not it detects also if md is in middle

        var allFiles = allPlugins.files.files;
        var allMarkdowns = [];

        allFiles.forEach(function(file){

            if (file.indexOf(".md")>-1) allMarkdowns.push(file);

        });

        // parse all markdowns and get nice huge object of markdowns

        allMarkdowns.forEach(function(markdownPath){

            var markdownArticle = _readFileByPath(markdownPath);
            var markdownBody = _getBody(markdownArticle);
            var markdownHeaderObj = _getHeaderObj(markdownArticle);

            markdownHeaderObj._content = markdownBody;
            markdownHeaderObj._originalpath = markdownPath;

            metaTags.push(markdownHeaderObj);

        });

        return metaTags;

    };


    var getAllMarkdowns = function(){

        var allMarkdowns = [];
        var allFiles = getFilteredFiles();

        // filter to only files which are markdowns
        allFiles.forEach(function(ele){



        });

        // create massive object
        allMarkdowns.forEach(function(currentMd, i){

            allMarkdowns[i] = {};

            // get file name like index.html
            var lastSlashPos = currentMd.substr(1).lastIndexOf("/");
            allMarkdowns[i]._filename = currentMd.substr(lastSlashPos+2);
            allMarkdowns[i]._filename = allMarkdowns[i]._filename.replace(".md", ".html");

            // add new path of html file
            allMarkdowns[i]._fullpath = currentMd.substr(0, lastSlashPos+2);
            if (allMarkdowns[i]._fullpath==="") allMarkdowns[i]._fullpath = "/";

            // add content from real md file with user content
            // underscore.extend(allMarkdowns[i], require("./__md-read")(currentMd));

            // compile content of user
            // allMarkdowns[i]._content = require("./md-compile")(allMarkdowns[i]._content);

        });

        return allMarkdowns;

    };


    var _readFileByPath = function(path) {

        var filesystem = require("fs");

        var template;
        template = filesystem.readFileSync("."+path);
        template += "";

        return template;

    };


    var _getHeaderObj = function(markdown) {

        var croppedByNewLineArr = markdown.split(/\n/);
        var delimiterPosition = croppedByNewLineArr.indexOf("---", 1);
        var markdownHeader = croppedByNewLineArr.slice(1, delimiterPosition);
        var markdownHeaders = {};

        markdownHeader.forEach(function(ele){

            var titleOfHeaderItem = ele.substr(0, ele.indexOf(":"));
            var valueOfHeaderItem = ele.substr(ele.indexOf(":")+1);

            // remove start or end or multiple whitespaces
            titleOfHeaderItem = underscore.clean(titleOfHeaderItem);
            valueOfHeaderItem = underscore.clean(valueOfHeaderItem);

            markdownHeaders[titleOfHeaderItem] = valueOfHeaderItem;

        });

        return markdownHeaders;

    };


    var _getBody = function(markdown) {

        var croppedByNewLineArr = markdown.split(/\n/);
        var delimiterPosition = croppedByNewLineArr.indexOf("---", 1)+1;
        var markdownBody = croppedByNewLineArr.slice(delimiterPosition);

        markdownBody = markdownBody.join("\n");

        return markdownBody;

    };