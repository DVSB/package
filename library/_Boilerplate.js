

	"use strict";


    var events = require("events");


	var Boilerplate = function() {

        events.EventEmitter.call(this);

		// add this.underscore to the this scope
        this.initUnderscore();

    };


	require("util").inherits(Boilerplate, events.EventEmitter);


    Boilerplate.prototype.initUnderscore = function(){

	    // normal require of underscore for nodejs
	    this.underscore = require("underscore");

	    // connect underscore string into
	    this.underscore.mixin(require("underscore.string").exports());

	    // change teamplate settings for mustache
	    this.underscore.templateSettings = {
		    evaluate:    /\{\{#([\s\S]+?)\}\}/g, // {{# console.log("blah") }}
		    interpolate: /\{\{[^#\{]([\s\S]+?)[^\}]\}\}/g, // {{ title }}
		    escape:      /\{\{\{([\s\S]+?)\}\}\}/g // {{{ <script> }}}
	    };

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
