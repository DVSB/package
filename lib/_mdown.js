"use strict";

    module.exports = function(){
        consoleInit();
    };

    if (process.env.PWD==="/Users/samuel/Documents/mdown"){
        consoleInit();
    }

    function consoleInit(){
        require("./console-echo.js")();
    }


