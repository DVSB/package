

    "use strict";


    var self = {};


    var plugins = [
        "files",
        "markdowns",
        "parse_mds",
        "copy_statics"
    ];

    plugins.forEach(function(current){
        var pluginPath = process.env.PWD+"/%plugins/"+current+"/export.js";
        self[current] = require(pluginPath).init(self);
    });

    // console.log(self);