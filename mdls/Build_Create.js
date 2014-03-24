

	"use strict";


	var CreateBuildDirectory = function() {

        require("../library/_Boilerplate").call(this);

	    this.on("error", function(error){
		    throw error;
	    });

		this.on("removed", function(){
			this.copyDirectory();
		});

		// call synch functions later
		this.removeFolder("./%build");

	};


	require("util").inherits(CreateBuildDirectory, require("../library/_Boilerplate"));


	CreateBuildDirectory.prototype.removeFolder = function(directory){

		var that = this;
        var fse = require("fs-extra");

		fse.remove(directory, function(err){
			if (err) that.emit("error", err);
			that.emit("removed");
		});

	};


	CreateBuildDirectory.prototype.copyDirectory = function(){

        var that = this;

        this.scan(function(scannedObj){

            var allFiles = scannedObj.files;
            var i = 0;
            var fse = require("fs-extra");

            function callback(){
                i++;
                if (i===allFiles.length) that.emit("ready");
            }

            allFiles.forEach(function(file){

                fse.copy(file, "%build/"+file, function(err){
                    if (err) that.emit("error", err);
                    callback();
                });

            });

        });

	};


	module.exports = new CreateBuildDirectory();
