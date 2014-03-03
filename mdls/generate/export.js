

    "use strict";


    var filesystem = require("fs");
    var log = require("./../../bin/echo.js");


    module.exports = function(statics, markdowns, templates, underscore){

        _parseMarkdowns(statics, markdowns, templates, underscore);
        _removeMdFilesInBuild(markdowns);

    };


    var _parseMarkdowns = function(statics, markdowns, templates, underscore){

        markdowns.forEach(function(scopeMarkdown){

            // current Template string
            var scopeMetaTemplate = scopeMarkdown.template;
            var scopeTemplate = templates[scopeMetaTemplate];

            // if user defined non-existing template or no header, skip file
            if (!scopeTemplate) {
                return;
            }

            try {

                var html = underscore.template(scopeTemplate, {
                    _ : underscore,
                    underscore : underscore,
                    local : scopeMarkdown,
                    markdowns : markdowns,
                    statics : statics,
                    templates : templates,
                    theme : templates
                });

            } catch(err) {

                log(scopeMarkdown._origin + " " + err, true);

            }


            // FS SAVE to new position to %build folder

            var originalPath = scopeMarkdown._target;

            var htmlPath = "%build"+scopeMarkdown._target;
            var fd = filesystem.openSync(htmlPath, 'w');
            filesystem.writeFileSync(htmlPath, html);
            filesystem.closeSync(fd);

        });

        global.downpress.isGenerating = false;

    };


    var _removeMdFilesInBuild = function(markdowns){

        markdowns.forEach(function(file){
            // filesystem.unlinkSync("./%build/"+file._origin);
        });

    };