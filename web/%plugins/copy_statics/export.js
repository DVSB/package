

    "use strict";


    module.exports.init = function(allPlugins) {

        var allFiles = allPlugins.files.files;
        var staticFiles = [];
        var filesystem = require("fs");

        // if is not markdown
        // TODO SHOULD BE SPECIFIED IN SOME SETTINGS
        // for : css, js, node, png, jgp, json ...
        allFiles.forEach(function(ele){
            var isNotMarkdown = ele.indexOf(".md")===-1;
            var isNotDsStore = ele.indexOf(".DS_Store")===-1;
            if (isNotMarkdown&&isNotDsStore) staticFiles.push(ele);
        });

        // copy every static file
        staticFiles.forEach(function(path){
            copyFile("."+path, "./%build/"+path.substr(1));
        });

        return staticFiles;

    };

    function copyFile(source, target) {

        var fs = require("fs");

        var rd = fs.createReadStream(source);

        rd.on("error", function(err) {
            console.log(err);
        });

        var wr = fs.createWriteStream(target);

        wr.on("error", function(err) {
            console.log(err);
        });

        wr.on("close", function(ex) {
            //console.log();
        });

        rd.pipe(wr);

    }

