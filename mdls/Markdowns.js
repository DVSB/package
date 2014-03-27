

    "use strict";


    /**
     *  Creates markdown object with parsed HTML with used layouts
     */
    var Markdowns = function() {

	    require("../library/_Boilerplate").call(this);
        this.getAllMarkdownsObjects();

    };


    require("util").inherits(Markdowns, require("../library/_Boilerplate"));


    /**
     *  Get list of all files in root of project (also non-markdown files)
     */
    Markdowns.prototype.getAllMarkdownsObjects = function(){

	    var that = this;
	    var CURRENT_FOLDER = ".";

	    this.walkFiles(CURRENT_FOLDER, function(files){
		    that.markdowns = files;
			that.removeTemplatesAndBuildFolder();
	    });

    };


    /**
     *  From this.markdowns should be removed all files from %build and %templates
     */
    Markdowns.prototype.removeTemplatesAndBuildFolder = function() {

	    var templatesDir = "./" + global.downpress.config["dir-templates"];
	    var buildDir = "./" + global.downpress.config["dir-build"];

	    function isNotDsStore(file){
		    return file.indexOf(".DS_Store") <= -1;
	    }

	    function isNotBuildDir(file){
		    return file.indexOf(buildDir)<=-1;
	    }

	    function isNotTemplatesDir(file){
		    return file.indexOf(templatesDir)<=-1;
	    }

	    function isOnlyMarkdown(file){
		    var extension = file.substr(file.lastIndexOf("."));
		    var isMarkdown = (extension===".md");
		    return isMarkdown;
	    }

	    this.markdowns = this.markdowns.filter(isNotDsStore);
	    this.markdowns = this.markdowns.filter(isNotTemplatesDir);
	    this.markdowns = this.markdowns.filter(isNotBuildDir);
	    this.markdowns = this.markdowns.filter(isOnlyMarkdown);

	    // go to next function and parse all files to objects
	    this.readMarkdownsOneByOne();

    };


    /**
     *  Read all Markdown files in project (content) and put into object this.markdowns
     */
    Markdowns.prototype.readMarkdownsOneByOne = function() {

	    var that = this;
	    var newMarkdowns = [];

	    var i=0;
	    function callbackOnFileRead(){
			i++;
		    if (that.markdowns.length-1===i) { everythingReady(); }
	    }

	    function readMarkdown(filePath){
		    that.fs.readFile(filePath, function(error, rawData){
			    fileReadDone(error, rawData, i);
		    });
	    }

	    function fileReadDone(error, rawData, i){
		    if (error) { throw error }
		    var content = { data : rawData+"", path : that.markdowns[i] };
		    newMarkdowns.push(content);
		    callbackOnFileRead();
	    }

	    function everythingReady(){
		    that.markdowns = newMarkdowns;
		    that.parseAllMarkdowns();
	    }

	    this.markdowns.forEach(readMarkdown);

    };


    /**
     *  Parse all this.markdowns and get header (meta tags) and body (user content)
     */
    Markdowns.prototype.parseAllMarkdowns = function() {

	    var that = this;
	    var allMarkdowns = [];

	    function getDependencies(markdownObj){
		    var resultObj = that.getHeaderMetaTags(markdownObj.data);
		    resultObj._content = that.getContentBody(markdownObj);
		    resultObj._path = markdownObj.path;
		    if (resultObj.template) { allMarkdowns.push(resultObj); }
	    }

	    this.markdowns.forEach(getDependencies);

	    // continue
	    this.markdowns = allMarkdowns;
	    this.addAllMetaTags();

    };


    /**
     *  All all other data like path, origin, target, uniqID, content
     */
    Markdowns.prototype.addAllMetaTags = function() {

		// get only markdowns, filter by containing of ".md" string
		// TODO should be improved = only if .md is on the end
		// TODO not it detects also if md is in middle

	    var that = this;

	    // parse all markdowns and get nice huge object of markdowns
		this.markdowns.forEach(function(markdownObj, i){

			// create a path without the file name
			var path = markdownObj._path;
			var cleanPath = path.substr(0, path.lastIndexOf("/")+1);
			that.markdowns[i]._path = cleanPath.substr(1);

			// add others attributes and tags
			that.markdowns[i]._origin = path.substr(path.lastIndexOf("/")+1);
			that.markdowns[i]._target = path.substr(path.lastIndexOf("/")+1);
			that.markdowns[i]._target = that.markdowns[i]._target.replace(".md", ".html");

			that.markdowns[i]._uniqid = that.getRandomID();
			that.markdowns[i]._content = require("marked")(markdownObj._content);

		});

		// DONE

		global.downpress.markdowns = this.markdowns;
	    this.emit("ready");

    };


    /**
     *  Parse content of the markdown object and get all meta tags
     */
    Markdowns.prototype.getHeaderMetaTags = function(markdownObj) {

	    // TODO all relevant future question which need to be solved
	    // this needs to be extremely sanitized
	    // what if delimiter is on the end of file?
	    // what if in markdown file is more delimiters?
	    // what if user will change delimiter to MD syntax?
	    // what if user will use just one delimiter?

	    var that = this;
	    var headerObj = {};

	    // crop markdown file by new line in editor
	    var croppedLines = markdownObj.split(/\n/);

	    // delimiter is by default "---" but can be changed by user
	    var delimiter = global.downpress.config["markdown-delimiter"];

	    // find delimiters or markdown files (---)
	    var delimiterOne = croppedLines.indexOf(delimiter, 0);
	    var delimiterTwo = croppedLines.indexOf(delimiter, 1);

	    // all lines between delimiters (first and second one)
	    var croppedHeader = croppedLines.slice(delimiterOne+1, delimiterTwo);

	    // create from lines objects with values and keywords
	    croppedHeader.forEach(function(oneLine){
		    var keyPairsObj = that.clearKeysAndValues(oneLine);
		    headerObj[keyPairsObj.title] = keyPairsObj.value;
	    });

	    // return all back
	    return headerObj;

    };


    /**
     *  Separate from line strings to values and keys, separated by ":" the default separator
     */
    Markdowns.prototype.clearKeysAndValues = function(oneLine) {

	    // separate strings by separator
	    var title = oneLine.substr(0, oneLine.indexOf(":"));
	    var value = oneLine.substr(oneLine.indexOf(":")+1);

	    // clean strings from empty spaces in the end
	    title = this.underscore.clean(title);
	    value = this.underscore.clean(value);

	    return { title : title, value : value };

    };


    /**
     *  Parse Object of parsed markdown file and save it to the content string
     */
    Markdowns.prototype.getContentBody = function(markdownObj) {

	    // raw data of file
	    var contentOfMarkdown = markdownObj.data;

	    // crop markdown file by new line in editor
	    var croppedLines = contentOfMarkdown.split(/\n/);

	    // delimiter is by default "---" but can be changed by user
	    var delimiter = global.downpress.config["markdown-delimiter"];
	    var delimiterTwo = croppedLines.indexOf(delimiter, 1);

	    // all lines after second delimiter
	    var croppedBody = croppedLines.slice(delimiterTwo+1);

	    // connect all lines together again
	    return croppedBody.join("\n");

    };


    /**
     *  Generate Uniq ID for files, can be used like uniq identifier on screen
     */
    Markdowns.prototype.getRandomID = function() {

	    var random1 = Math.floor((Math.random()*800000)+100000);
	    var random2 = Math.floor((Math.random()*800000)+100000);
	    var random3 = Math.floor((Math.random()*800000)+100000);

	    return(random1+random2+random3).toString(36);

    };


    module.exports = new Markdowns();

