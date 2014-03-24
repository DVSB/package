

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

        function removed(error){

            if (error) {
                that.emit("error", error); return;
            }

            that.copyBuildFolder();

        }

		this.fs.remove(BUILD_FOLDER, removed);

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

        var BUILD_FOLDER = "./" + global.downpress.config["dir-build"];
        var i = 0;
        var that = this;

        function callback(){
            i++;
            if (i===allFiles.length) { that.emit("ready"); }
        }

        allFiles.forEach(function(file){

            that.fs.copy(file, BUILD_FOLDER+"/"+file, function(err){
                if (err) { that.emit("error", err); }
                callback();
            });

        });

    };


	module.exports = new CreateBuildDirectory();
