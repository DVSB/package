

    "use strict";


    require("colors");


    module.exports = function(func) {

        switch (func) {

            case "0001" :
                _message0001();
                break;

            case "0002" :
                _message0002();
                break;

            default :
                console.log(_getDate().grey + "error: ".red + func.blue);
                break;

        }

    };


    var _getDate = function(){

        return new Date().toLocaleTimeString() + " [mdown] - ";

    };


    var _message0001 = function(){

        console.log("\n");
        console.log(_getDate().grey + "be welcome, my friend, in mdown".blue);
        console.log(_getDate().grey + "watching folder".blue);

    };


    var _message0002 = function(){

        console.log(_getDate().grey + "good bye, user".blue);

    };
