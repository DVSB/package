

	"use strict";


    /**
     *  Plugin is copying all files from a website directory to the build folder
     */
	var CreateBuildDirectory = function() {

        require("../library/_Boilerplate").call(this);

        var that = this;

        this.on("error", function(error){
            that.log("ERROR -- unexpected error, please report this", true);
            process.kill();
        });

		// remove old build folder with whole content
		this.removeFolder();

	};


	require("util").inherits(CreateBuildDirectory, require("../library/_Boilerplate"));


    /**
     *  Plugin is copying all files from a website directory to the build folder
     */
	CreateBuildDirectory.prototype.removeFolder = function(){

		var that = this;
        var BUILD_FOLDER = "./" + global.downpress.config["dir-build"];

		this.fs.remove(BUILD_FOLDER, function(error){
			if (error) { throw error; }
			that.copyBuildFolder();
		});

	};


    /**
     *  Copy whole content into the build folder as is
     */
	CreateBuildDirectory.prototype.copyBuildFolder = function(){

        var that = this;

        this.walkFiles(".", function(files){
            that.removeTemplatesFolder(files);
        });

	};


    /**
     *  Remove %templates folder from files
     */
    CreateBuildDirectory.prototype.removeTemplatesFolder = function(files){

        var TEMPLATES_DIR = "./" + global.downpress.config["dir-templates"];

        function removeTemplatesDir(file){
            return file.indexOf(TEMPLATES_DIR)<=-1;
        }

        files = files.filter(removeTemplatesDir);

        this.copyFiles(files);

    };


    /**
     *  Copy whole content into the build folder as is
     */
    CreateBuildDirectory.prototype.copyFiles = function(allFiles){

	    var that = this;
	    var BUILD_FOLDER = "./" + global.downpress.config["dir-build"];

        allFiles.forEach(function(file){
	        that.fs.copySync(file, BUILD_FOLDER+"/"+file);
        });

        this.emit("ready");

    };



    module.exports = function(){
        return new CreateBuildDirectory();
    };
