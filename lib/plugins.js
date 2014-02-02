

    "use strict";


// this is fucking beautiful piece of javascript, yeah!
// defined plugin structure


    module.exports = function(){

        var builded = function(){

            pluginInit("all_files");
            pluginInit("markdowns");
            pluginInit("parse_markdowns");

        };

        pluginInit("build_create", builded);

    };


    var pluginInit = function(pluginName, callback){

	    var pluginPath = process.env.PWD+"/%plugins/"+pluginName+"/export";
	    require(pluginPath).init(callback);

    };

    // TODO check this for avoiding to callbacks and inheritance
    // http://bit.ly/1a7cYEc





