

    "use strict";


    var filesystem = require("fs");


    /**
     *  Create all necessary objects which are accessible also on the screen
     */
    var Generate = function() {

        require("../library/_Boilerplate").call(this);

        this.parseMarkdowns();
        this.removeMdFilesInBuild();

    };


    require("util").inherits(Generate, require("../library/_Boilerplate"));


    /**
     *
     */
    Generate.prototype.parseMarkdowns = function(){

        var that = this;
	    var markdowns = global.downpress.markdowns;

	    // one by one create and generate every one markdown file
	    markdowns.forEach(function(element){
            that.buildMarkdownAndSaveIt(element);
        });

    };


    /**
     *  Build markdown and save it to the build folder
     */
    Generate.prototype.buildMarkdownAndSaveIt = function(scopeMarkdown){

	    // current Template string
	    var metaTagTemplate = scopeMarkdown.template;
	    var scopeTemplate = global.downpress.templates[metaTagTemplate];

	    // if user defined non-existing template or no header, skip file
	    if (!scopeTemplate) {  return; }

        // try build a next fancy markdown file via templates
	    try {
		    var html = this.createTemplateObject(scopeTemplate, scopeMarkdown);
	    } catch(err) {
		    this.log(scopeMarkdown._origin + " " + err, true);
	    }

        // FS SAVE to new position to %build folder
        var buildDir = "./" + global.downpress.config["dir-build"];
	    var htmlPath = buildDir+scopeMarkdown._path+scopeMarkdown._target;
	    this.createNewFile(htmlPath, html);

    };


    /**
     *  Create a new file from given name and content
     */
    Generate.prototype.createNewFile = function(path, content){

        this.fs.writeFileSync(path, content);

    };


    /**
     *  Create a new file from given name and content
     */
    Generate.prototype.createTemplateObject = function(template, content){

	    return this.underscore.template(template, {
		    _ : this.underscore,
		    underscore : this.underscore,
		    local : content,
		    markdowns : global.downpress.markdowns,
		    statics : global.downpress.statics,
		    templates : global.downpress.templates
	    });

    };


    /**
     *
     */
    Generate.prototype.removeMdFilesInBuild = function(){

        var markdowns = global.downpress.markdowns;
        var buildDir = "./" + global.downpress.config["dir-build"];
        var that = this;

        var i = 0;

        function callbackRemovedFiles(error){
            if (error) { throw error; }
            i++;
            if (i===markdowns.length) { that.emit("ready"); }
        }

        markdowns.forEach(function(file){
            var path = buildDir + file._path + file._origin;
            that.fs.unlink(path, callbackRemovedFiles);
        });

    };



    module.exports = function(){
        return new Generate();
    };

