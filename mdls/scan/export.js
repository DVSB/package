

	"use strict";


	var events = require("events");
	var walker = require("walk").walk(".");


	var Scanner = function() {

		events.EventEmitter.call(this);

		this.updateAllFiles();

	};


	require("util").inherits(Scanner, events.EventEmitter);


	Scanner.prototype.updateAllFiles = function(){

		this.files = [];
		this.folders = [];

		var that = this;

		walker.on("file", function (root, fileStats, next) {
			that.files.push(root + "/" + fileStats.name);
			next();
		});

		walker.on("directories", function (root, dirStatsArray, next) {
			dirStatsArray.forEach(function(each){
				that.folders.push(root + "/" + each.name);
			});
			next();
		});

		walker.on("end", function () {
			that.emit("ready", this);
		});

	};


	module.exports = new Scanner();
