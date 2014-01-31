

    "use strict";


// this is fucking beautiful piece of javascript, yeah!
// defined plugin structure


    var run = function(pluginName, callback){

	    var pluginPath = process.env.PWD+"/%plugins/"+pluginName+"/export";
	    require(pluginPath).init(callback);

    };


// defined your code here >


    run("build_create", function(){

	    run("all_files", plugin_all_files);

    });


    // check this for avoiding to callbacks and inheritance
    // http://www.wekeroad.com/2012/04/05/cleaning-up-deep-callback-nesting-with-nodes-eventemitter/


    var plugin_all_files = function(all_files){

	    console.log(all_files);

    };


