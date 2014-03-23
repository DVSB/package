

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


    Boilerplate.prototype.scan = function(callback){

        var walker = require("walk").walk(".", { filters: [".git", ".svn"] });

        var files = [];
        var folders = [];

        walker.on("file", function (root, fileStats, next) {
            files.push(root + "/" + fileStats.name);
            next();
        });

        walker.on("directories", function (root, dirStatsArray, next) {
            dirStatsArray.forEach(function(each){
                folders.push(root + "/" + each.name);
            });
            next();
        });

        walker.on("end", (function () {
            callback({ files : files, folders : folders });
        }).bind(this));

    };


	module.exports = Boilerplate;