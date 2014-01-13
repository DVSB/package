"use strict";

    module.exports = function(){
        consoleInit();
    };

    function consoleInit(){
        console.log("hello world mdown package");
        require("console-echo.js")();
    }