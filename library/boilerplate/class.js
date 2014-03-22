

	"use strict";


    var events = require("events");
    require("colors");


	var Boilerplate = function() {

        events.EventEmitter.call(this);

        this.initUnderscore();

    };


	require("util").inherits(Boilerplate, events.EventEmitter);


    Boilerplate.prototype.initUnderscore = function(){

        var that = this;

        require("../../mdls/underscore/export")((function(underscore){
            this.underscore = underscore;
        }).bind(this));

	};


    Boilerplate.prototype.log = function(message, isError){

        var log;


        log = new Date().toLocaleTimeString().grey;
        log += ": ".grey;

        if (isError) {
            log += message.red.bold
        } else {
            log += message.blue.bold;
        }


        console.log(log);

    };


	module.exports = Boilerplate;