

    underscore = require("underscore");
    underscore.templateSettings = {
        evaluate:    /\{\{#([\s\S]+?)\}\}/g, // {{# console.log("blah") }}
        interpolate: /\{\{[^#\{]([\s\S]+?)[^\}]\}\}/g, // {{ title }}
        escape:      /\{\{\{([\s\S]+?)\}\}\}/g, // {{{ <script> }}}
    };
    underscore.mixin(require("underscore.string").exports());

    FILES = require("./generate/const-FILES")();


    var generate = function(){

        console.info(+new Date() + " > rebuilded");

        var filesystem = require("fs");
        var compile = require("./generate/markdown-compile");
        var read = require("./generate/markdown-read");
        var markdownFiles = [];
        var otherTypeFiles = [];

        FILES.files.forEach(function(ele){
            if (ele.indexOf(".md")>-1) {
                markdownFiles.push(ele);
            } else { otherTypeFiles.push(ele); }
        });

        _cleanFolder("../web/%build");
        _createFolders();

        markdownFiles.forEach(function(pathToMarkdown){

            var currentMdObj = read(pathToMarkdown);
            var html = compile(currentMdObj);
            var newPath = buildPathFromOriginalPath(pathToMarkdown);

            var fd = filesystem.openSync(newPath, 'w');
            filesystem.writeFileSync(newPath, html);
            filesystem.closeSync(fd);

        });

    };

    var _cleanFolder = function(path) {

        var files = [];
        var filesystem = require("fs");

        if ( filesystem.existsSync(path) ) {

            files = filesystem.readdirSync(path);

            files.forEach(function(file,index){
                var curPath = path + "/" + file;
                if(filesystem.statSync(curPath).isDirectory()) {
                    _cleanFolder(curPath);
                } else {
                    filesystem.unlinkSync(curPath);
                }
            });

            filesystem.rmdirSync(path);

        }

    };

    var _createFolders = function() {

        var sortedFolders = FILES.folders.sort();
        var filesystem = require("fs");

        filesystem.mkdirSync("../web/%build");

        sortedFolders.forEach(function(folder){
            var newPath = buildPathFromOriginalPath(folder);
            filesystem.mkdirSync(newPath);
        });

    };

    var buildPathFromOriginalPath = function(originalPath){

        // TODO this must be fixed later, from ../web broken path
        return underscore(originalPath).splice(7, 0, "%build/");

    };

    generate();


    /*
    require("chokidar").watch(
        "../web/",
        { ignored: /[\/\\]\./, persistent: true }
    ).on("all", function(event, path){
        console.log(+new Date() + " > " + event + " > " + path);
    });
    */