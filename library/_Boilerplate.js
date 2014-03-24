

	"use strict";


    var events = require("events");


	var Boilerplate = function() {

        events.EventEmitter.call(this);

        this.initUnderscore();

    };


	require("util").inherits(Boilerplate, events.EventEmitter);


    Boilerplate.prototype.initUnderscore = function(){

        var that = this;

        require("../mdls/underscore/export")((function(underscore){

            this.underscore = underscore;

        }).bind(this));

	};


    Boilerplate.prototype.log = function(message, isError){

        var log;
        require("colors");

        log = new Date().toLocaleTimeString().grey;
        log += ": ".grey;

        if (isError) {
            log += message.red.bold
        } else {
            log += message.blue.bold;
        }

        console.log(log);

    };


    /**
     *  Gets list of all files from directory
     */
    Boilerplate.prototype.walkFiles = function(directory, callback){

        var walker = require("walk").walk(directory, { filters: [".git", ".svn", ".DS_Store"] });
        var files = [];

        walker.on("file", function(root, fileStats, next) {
            files.push(root + "/" + fileStats.name);
            next();
        });

        walker.on("end", function() {
            callback(files);
        });

    };



	Boilerplate.prototype.fs = require("fs-extra");


	module.exports = Boilerplate;
