

    module.exports = function() {

        removeRecursivelyDir("../web/%build/");

        return {
            removeDir : removeRecursivelyDir()
        };

    };


    var filesystem = require("fs");


    var removeRecursivelyDir = function(path){

        var files = [];

        if ( filesystem.existsSync(path) ) {

            files = filesystem.readdirSync(path);

            files.forEach(function(file){
                var curPath = path + "/" + file;
                if(filesystem.statSync(curPath).isDirectory()) {
                    removeRecursivelyDir(curPath);
                } else {
                    filesystem.unlinkSync(curPath);
                }
            });

            filesystem.rmdirSync(path);

        }

    };
