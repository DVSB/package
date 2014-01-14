

    "use strict";


    // this is used like setter, when we generating just now its false
    var isListening = true;
    module.exports.listen = function(status){
        isListening = status;
        console.log(">> setter " + status);
    };


    var watcher = require('chokidar').watch(
        './',
        { ignored:/[\/\\]\./, persistent:true, interval:1000 }
    );

    // if you are webdeveloper just watch also folder up to
    if (process.env.PWD==="/Users/samuel/Documents/mdown/web"){
        // watcher.add("../");
        // now we using nodemon in second window
    }

    var echoStatus = "firsttime";

    watcher.on("all", function(event, path){

        console.log(">>> " + isListening);

        if (!isListening) {
            // don't listen on any changes if just now is generating
            return;
        }

        if (echoStatus==="normalecho") {

            // echo message to user so he can know wthell
            require("./echo")("0006", event, path);

            // regenerate whole web
            require("./cmnd-watch").regenerate();

        }

        if (echoStatus==="firsttime") {

            // after 2000 should be echo every file
            echoStatus = "ignoreothers";

            // on every change (add, rename, edit..) regenerate
            require("./cmnd-watch").regenerate();

            // because of first initial echo of many files
            setTimeout(function(){ echoStatus="normalecho"; }, 2000);

        }

    });