

	"use strict";


	var Scanner = function() {

        require("../../library/boilerplate/class").call(this);

		this.updateAllFiles();

        var that = this;
        var i = 0;

        this.on("callback", function(){
            i++;
            if (i===2) that.emit("ready");
        });

	};


    require("util").inherits(Scanner, require("../../library/boilerplate/class"));


	Scanner.prototype.updateAllFiles = function(){

        var walker = require("walk").walk(".");

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
			that.emit("callback");
		});

	};


	module.exports = new Scanner();
