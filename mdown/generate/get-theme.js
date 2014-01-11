

    var THEME = {};
    var filesystem = require("fs");


    module.exports = function() {

        attachUserSettings();

        return THEME;

    };


    var attachUserSettings = function() {

        var walk = require("../node_library/walk")();
        var themeFiles = walk.getFiles("../web/"+SETTINGS._folders.theme);

        themeFiles.forEach(function(ele, i){
            var themeFile = filesystem.readFileSync(ele)+"";
            var name = ele.slice(ele.lastIndexOf("/")+1).split(".html")[0];
            THEME[name] = themeFile;
        });

    };
