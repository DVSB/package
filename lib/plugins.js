

    "use strict";


    var self = {};


    var plugins = [
        "all_files",
        "meta_tags"//,
        //"generate_md"
    ];

    plugins.forEach(function(current){
        var pluginPath = process.env.PWD+"/%plugins/"+current+"/export.js";
        self[current] = require(pluginPath).init(self);
    });

    console.log(self);