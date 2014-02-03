

    "use strict";


    var getAllPluginConfigs = function(){

	    var filesystem = require("fs");
		var allPluginFolders = filesystem.readdirSync(__dirname+"/../plugins/");

	    var allDirectories = [];
	    var allConfigurations = {};

	    // get all folders in the plugin folder
	    allPluginFolders.forEach(function(file) {
		    var stat = filesystem.statSync(__dirname+"/../plugins/"+file);
		    if (stat && stat.isDirectory()) allDirectories.push(file);
	    });

	    // get all plugins package configurations
	    allDirectories.forEach(function(plugin) {
		    var pluginPath = __dirname+"/../plugins/"+plugin+"/package.json";
		    var fileContent = filesystem.readFileSync(pluginPath);
		    allConfigurations[plugin] = JSON.parse(fileContent);
	    });

	    return allConfigurations;

    };

    module.exports = function(){


        var builded = function(){

            pluginInit("all_files");
            pluginInit("parse_markdowns");

        };

        pluginInit("build_create", builded);

    };

    // export list of all modules and create localhost preview
    module.exports.plugins = function(){
	    return getAllPluginConfigs();
    };


    var pluginInit = function(pluginName, callback){

	    var pluginPath = process.env.PWD+"/%plugins/"+pluginName+"/export";
	    require(pluginPath).init(callback);

    };

    // TODO check this for avoiding to callbacks and inheritance
    // http://bit.ly/1a7cYEc





