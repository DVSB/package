

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

        var BUILD_FOLDER = "./" + global.downpress.config["dir-build"];
		this.fs.remove(BUILD_FOLDER, (this.removedBuildFolder).bind(this));

	};


	/**
	 *  After the build folder is removed or when removing of folder cause an error
	 */
	CreateBuildDirectory.prototype.removedBuildFolder = function(error){

		if (error) {
			this.emit("error", error);
			return;
		}

		// if everything was without error, run next function
		this.copyBuildFolder();

	};


    /**
     *  Copy whole content into the build folder as is
     */
	CreateBuildDirectory.prototype.copyBuildFolder = function(){

        var that = this;

        this.walkFiles(".", function(files){
            that.copyFiles(files);
        });

	};


    /**
     *  Copy whole content into the build folder as is
     */
    CreateBuildDirectory.prototype.copyFiles = function(allFiles){

	    var that = this;
        var i = 0;

	    function onFileCopied(error){
		    if (error) { that.emit("error", error); }
		    i++;
		    if (i===allFiles.length) { that.emit("ready"); }
	    }

	    var BUILD_FOLDER = "./" + global.downpress.config["dir-build"];

        allFiles.forEach(function(file){
	        that.fs.copy(file, BUILD_FOLDER+"/"+file, onFileCopied);
        });

    };


	module.exports = new CreateBuildDirectory();
