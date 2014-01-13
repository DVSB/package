"use strict";

    module.exports = function(){
        consoleInit();
    };

    function consoleInit(){
        console.log("hello world mdown package");
        require("../generate/console-echo.js")();
    }