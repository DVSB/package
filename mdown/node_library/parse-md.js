

    module.exports = function(path, data) {

        var markdownArticle = readFileByPath(path);
        var markdownBody = getBody(markdownArticle);
        var markdownHeader = getHeader(markdownArticle);

        markdownHeader.content = markdownBody;

        return markdownHeader;

    };


    var readFileByPath = function(path) {

        var filesystem = require("fs");

        var template;
        template = filesystem.readFileSync("../web/" + path);
        template += "";

        return template;

    };


    var getHeader = function(markdown) {

        var croppedByNewLineArr = markdown.split(/\n/);
        var delimiterPosition = croppedByNewLineArr.indexOf("---", 1);
        var markdownHeader = croppedByNewLineArr.slice(1, delimiterPosition);
        var markdownHeaders = {};

        markdownHeader.forEach(function(ele, i){

            var titleOfHeaderItem = ele.substr(0, ele.indexOf(":"));
            var valueOfHeaderItem = ele.substr(ele.indexOf(":")+1);

            // remove start or end or multiple whitespaces
            titleOfHeaderItem = underscore.clean(titleOfHeaderItem);
            valueOfHeaderItem = underscore.clean(valueOfHeaderItem);

            markdownHeaders[titleOfHeaderItem] = valueOfHeaderItem;

        });

        return markdownHeaders;

    };


    var getBody = function(markdown) {

        var croppedByNewLineArr = markdown.split(/\n/);
        var delimiterPosition = croppedByNewLineArr.indexOf("---", 1)+1;
        var markdownBody = croppedByNewLineArr.slice(delimiterPosition);

        markdownBody = markdownBody.join("\n");

        return markdownBody;

    };