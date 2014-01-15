

    "use strict";


    // this is used like setter, when we generating just now its false
    var isListening = true;
    module.exports.listen = function(status){
        isListening = status;
        // console.log("listen was change to: " + status);
    };

    var watcher = require('chokidar').watch(
        './',
        { ignored:/%build/, persistent:true, interval:1000, ignoreInitial:true }
    );

    // if you are webdeveloper just watch also folder up to
    if (process.env.PWD==="/Users/samuel/Documents/mdown/web"){
        // watcher.add("../");
        // now we using nodemon in second window
    }

    // this is excluding folders from watching - useless complications
    watcher.on("unlink", function(path){ act("unlinked", path) });
    watcher.on("add", function(path){ act("added", path) });
    watcher.on("change", function(path){ act("changed", path) });

    // is run on Add, Change or Unlink
    function act(event, path){

        // don't listen on any changes if just now is generating
        if (!isListening) { return; }

        // echo message to user so he can know wthell
        require("./echo")("0006", event, path);

        // regenerate whole web
        require("../bin/cmnd-watch").regenerate();

    }
