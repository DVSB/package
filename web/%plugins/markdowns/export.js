

    "use strict";


    // normal require of underscore for nodejs
    var underscore = require("underscore");
    underscore.mixin(require("underscore.string").exports());



    module.exports.init = function(callback) {

        if (!callback) return;

        require("../all_files/export").init(function(allFiles){
            var parsedMarkdowns = parseMarkdowns(allFiles);
            callback(parsedMarkdowns);
        });

    };


    module.exports.version = function() {

        return "1.0.1";

    };



    var parseMarkdowns = function(allFiles){

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

        allMarkdowns.forEach(function(markdownPath){

            var markdownArticle = _readFileByPath(markdownPath);
            var markdownBody = _getBody(markdownArticle);
            var markdownHeaderObj = _getHeaderObj(markdownArticle);

            markdownHeaderObj.content = markdownBody;
            markdownHeaderObj.originalpath = markdownPath;

            metaTags.push(markdownHeaderObj);

        });

        return metaTags;

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

