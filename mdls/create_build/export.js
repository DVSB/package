

	"use strict";


	var fse = require("fs-extra");
	var events = require("events");


	var CreateBuildDirectory = function() {

	    events.EventEmitter.call(this);

	    this.on("error", function(error){
		    throw error;
	    });

		this.on("removed", function(){
			this.copyDirectory();
		});

		// call synch functions later
		this.removeFolder("./%build");

	};


	require("util").inherits(CreateBuildDirectory, events.EventEmitter);


	CreateBuildDirectory.prototype.removeFolder = function(directory){

		var that = this;

		fse.remove(directory, function(err){
			if (err) that.emit("error", err);
			that.emit("removed");
		});

	};


	CreateBuildDirectory.prototype.copyDirectory = function(){

		var allFiles = downpress.scan.files;
		var i = 0;
		var that = this;

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

	};


	module.exports = new CreateBuildDirectory();
