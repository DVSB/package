

    "use strict";


    module.exports.initialization = function() {

        // watch user current folder (and in dev this folder)
        require("./lib-chokidar");

    };


    module.exports.regenerate = function() {

        console.log("regenerate starts");

        // TODO
        // not sure what is wrong with genering workflow
        // check it tomorrow :)
        // sorry

        // disabled listening for a moment
        require("./lib-chokidar").listen(false);

        // remove force whole %build dir with whole content
        require("./lib-filesystem")().removeDir("./%build");

        // replace all markdown files to folders
        require("./generate").builddir();

        // replace all markdown files to folders
        require("./generate").folders();

        // replace all assets to relevant folders
        require("./generate").markdowns();

        // replace all markdown files to folders
        require("./generate").assets();

        // generating is finished, enable listening
        require("./lib-chokidar").listen(true);

    };

