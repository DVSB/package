

    underscore = require("underscore");
    underscore.templateSettings = {
        evaluate:    /\{\{#([\s\S]+?)\}\}/g, // {{# console.log("blah") }}
        interpolate: /\{\{[^#\{]([\s\S]+?)[^\}]\}\}/g, // {{ title }}
        escape:      /\{\{\{([\s\S]+?)\}\}\}/g, // {{{ <script> }}}
    };
    underscore.mixin(require("underscore.string").exports());

    //SETTINGSFILES = require("./generate/get-settings-files")();
    //USERFILES = require("./generate/get-all-files")();
    //THEMEFILES = require("./generate/get-theme-files")();

    console.log(require("./generate/const-FILES")());

    var generate = function(){

        // get only markdown files

        var markdownFiles = [];

        USERFILES.filteredfiles.forEach(function(ele){
            var isMdFile = ele.indexOf(".md")>-1;
            if (isMdFile) markdownFiles.push(ele);
        });

        console.log(USERFILES);

        // for each markdown proceed

        var pluginMakrodwnCompile = require("./generate/markdown-compile");
        var pluginMarkdownRead = require("./generate/markdown-read");

        markdownFiles.forEach(function(ele){

            var pathToMarkdown = ele;
            var filesystem = require("fs");

            console.log("\n\n\n- - - - - - - - - - - - - - - - - - - - - - -");
            console.log(pathToMarkdown);
            console.log("- - - - - - - - - - - - - - - - - - - - - - -");

            var currentMdObj = pluginMarkdownRead(pathToMarkdown);
            var html = pluginMakrodwnCompile(currentMdObj);

            var newPath = buildPathFromOriginalPath(pathToMarkdown);
            //filesystem.writeFileSync(newPath, html);

        });

    };

    var getOnlyMarkdownFiles = function(){

        var shouldBeProceed = USERFILES.filteredfiles;
        var onlyMarkdownFiles = [];

        shouldBeProceed.forEach(function(ele){
            var isMdFile = ele.indexOf(".md")>-1;
            if (isMdFile) onlyMarkdownFiles.push(ele);
        });

        return onlyMarkdownFiles;

    };

    var buildPathFromOriginalPath = function(originalPath){

        // TODO this must be fixed later, from ../web broken path
        return underscore(originalPath).splice(7, 0, "%build/");

    };

    // generate();


    // this is used only in production
    // in development we have nodemon which watchs

    var onAnyChange = function(event, path){
        // console.log(+new Date() + " > " + event + " > " + path);
    };



    require("chokidar").watch(
        "../web/",
        { ignored: /[\/\\]\./, persistent: true }
    ).on("all", onAnyChange);