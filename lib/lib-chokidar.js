

    "use strict";


    var watcher = require('chokidar').watch(
        './',
        {ignored: /[\/\\]\./, persistent: true}
    );

    // if you are webdeveloper just watch also folder up to
    if (process.env.PWD==="/Users/samuel/Documents/mdown/web"){
        watcher.add("../");
    }

    var echoStatus = "firsttime";

    watcher.on("all", function(event, path){

        if (echoStatus==="normalecho") {
            regenerate();
        }

        if (echoStatus==="firsttime") {
            echoStatus = "ignoreothers";
            setTimeout(function(){ echoStatus="normalecho"; regenerate(); }, 2000);
        }

    });

    var regenerate = function(){

        // remove force whole %build dir with whole content
        require("./lib-filesystem")().removeDir("./%build");

        // replace all markdown files to folders
        // require("./xxx")();

        // replace all assets to relevant folders
        // require("./xxx")();

    };