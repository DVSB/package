

    "use strict";


    module.exports = function(){


        var alreadyBuilt = function(){

            // before parse
            pluginInit("all_files");

            // in parse
            pluginInit("parse_markdowns");

        };

        pluginInit("build_create", alreadyBuilt);

    };


    var pluginInit = function(pluginName, callback){

	    var pluginPath = "./../plugins/"+pluginName+"/export";
	    require(pluginPath).init(callback);

    };

    // TODO check this for avoiding to callbacks and inheritance
    // http://bit.ly/1a7cYEc





