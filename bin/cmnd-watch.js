

    "use strict";


    module.exports.initialization = function() {

        // watch user current folder (and in dev this folder)
        require("../lib/lib-chokidar");

    };


    module.exports.regenerate = function() {

        // disabled listening for a moment
        require("../lib/lib-chokidar").listen(false);

        // remove force whole %build dir with whole content
        require("../lib/lib-filesystem")().removeDir("./%build");

        // replace all markdown files to folders
        require("../lib/generate").builddir();

        // replace all markdown files to folders
        require("../lib/generate").folders();

        // replace all assets to relevant folders
        require("../lib/generate").markdowns();

        // replace all markdown files to folders
        require("../lib/generate").assets();

        // generating is finished, enable listening
        require("../lib/lib-chokidar").listen(true);

    };

