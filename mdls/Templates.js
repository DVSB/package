

    "use strict";


    /**
     * Creates an object with all templates in %templates folder just like raw text
     */
    var Templates = function() {

        require("../library/_Boilerplate").call(this);

	    this.getAllTemplateFiles();

    };


    require("util").inherits(Templates, require("../library/_Boilerplate"));


    /**
     * Get all files in templates folder, also with weird non-html files
     */
    Templates.prototype.getAllTemplateFiles = function() {

	    var that = this;
	    var templatesDir = "./" + global.downpress.config["dir-templates"];

	    this.walkFiles(templatesDir, function(files){
		    that.files = files;
		    that.removeNonHtmlFiles();
	    });

    };


    /**
     * Remove all files which are not really templates and are don't HTML/HTM
     */
    Templates.prototype.removeNonHtmlFiles = function() {

	    this.parseAllTemplateFiles();

    };


    /**
     * Read content of theme files and put into smart object downpress.templates
     */
    Templates.prototype.parseAllTemplateFiles = function() {

	    var that = this;

	    function forEverySingle(templatePath, i){
		    that.readFile(templatePath, i, that);
	    }

        this.files.forEach(forEverySingle);

    };


    /**
     * When file is read or with error or correctly
     */
    Templates.prototype.readFile = function(templatePath, i, that) {

	    this.templatesObj = {};

	    // convert path to the clear file name
	    var lastSlash = templatePath.lastIndexOf("/")+1;
	    var fileName = templatePath.slice(lastSlash);
	    var templateName = fileName.split(".html")[0];

	    that.fs.readFile(templatePath, onFileReaded);

	    // when all files are already read and saved
	    function allDone(){
		    global.downpress.templates = that.templatesObj;
		    that.emit("ready");
	    }

	    // when one specific file is read from filesystem
	    function onFileReaded(err, rawContent){
		    if (err) { throw err; }
		    that.templatesObj[templateName] = rawContent+"";
		    var howManyTemplates = that.files.length-1;
		    if (howManyTemplates===i) { allDone(); }
	    }

    };


    module.exports = function(){
        return new Templates();
    };
