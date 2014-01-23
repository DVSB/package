

    "use strict";


    module.exports = function(path) {

        var markdownArticle = _readFileByPath(path);
        var markdownBody = _getBody(markdownArticle);
        var markdownHeaderObj = _getHeaderObj(markdownArticle);

        markdownHeaderObj._content = markdownBody;
        return markdownHeaderObj;

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
        var UNDERS = require("./lib-underscore");

        markdownHeader.forEach(function(ele){

            var titleOfHeaderItem = ele.substr(0, ele.indexOf(":"));
            var valueOfHeaderItem = ele.substr(ele.indexOf(":")+1);

            // remove start or end or multiple whitespaces
            titleOfHeaderItem = UNDERS.clean(titleOfHeaderItem);
            valueOfHeaderItem = UNDERS.clean(valueOfHeaderItem);

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