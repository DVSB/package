

    "use strict";


	/**
	 *
	 */
    var Minifier = function(){

        this.compressor = require("node-minify");

        this.files = [
            "node_modules/colors/colors.js"
        ];

        new this.compressor.minify({
            type: "no-compress",
            fileIn: this.files,
            fileOut: "minified/test.js"
        });

    };


    new Minifier();
