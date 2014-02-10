

    "use strict";


    var underscore = require("underscore");


    module.exports = function(callback) {

	    require("../all_files/export").init(function(allFiles){
		    callback(allFiles, getAllMarkdownsObjects(allFiles));
	    });

    };


    var getAllMarkdownsObjects = function(allFiles){

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

		    markdownHeaderObj.mdpath = markdownPath;
		    markdownHeaderObj.htmlpath = markdownPath.replace(".md", ".html");
		    markdownHeaderObj.path = markdownPath.substr(0, markdownPath.lastIndexOf("/")+1);

            markdownHeaderObj.content = require('marked')(markdownBody);
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

