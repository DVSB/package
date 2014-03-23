

    "use strict";


    var filesystem = require("fs");


    var Generate = function() {

        require("./_Boilerplate").call(this);

        this.parseMarkdowns();
        this.removeMdFilesInBuild();

        setTimeout((function(){
            this.emit("ready")
        }).bind(this), 1);

    };


    require("util").inherits(Generate, require("./_Boilerplate"));


    Generate.prototype.parseMarkdowns = function(){

        var statics = global.downpress.statics;
        var markdowns = global.downpress.markdowns;
        var templates = global.downpress.templates;

        var that = this;

        markdowns.forEach(function(scopeMarkdown){

            // current Template string
            var scopeMetaTemplate = scopeMarkdown.template;
            var scopeTemplate = templates[scopeMetaTemplate];

            // if user defined non-existing template or no header, skip file
            if (!scopeTemplate) {
                return;
            }

            try {

                var html = that.underscore.template(scopeTemplate, {
                    _ : that.underscore,
                    underscore : that.underscore,
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


    Generate.prototype.removeMdFilesInBuild = function(){

        var markdowns = global.downpress.markdowns;

        markdowns.forEach(function(file){
            // filesystem.unlinkSync("./%build/"+file._origin);
        });

    };



    module.exports = new Generate();

