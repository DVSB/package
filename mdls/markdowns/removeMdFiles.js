

    "use strict";


    module.exports = function(markdowns) {

        // TODO BUG
        // we don't want remove all markdowns from build
        // only these which are generated like a html
        // skip README and LICENCE

	    // remove all markdown files from original folder

	    var filesystem = require("fs");

	    markdowns.forEach(function(mdfile){
            console.log(mdfile);
		    filesystem.unlinkSync("./%build/"+mdfile.mdpath);
	    });

    };
