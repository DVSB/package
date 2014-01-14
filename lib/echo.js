

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

            case "0003" :
                _message0003();
                break;

            case "0004" :
                _message0004();
                break;

            default :
                _log("doesnt exists: ".red + func.red);
                break;

        }

    };


    var _log = function(message){

        console.log(new Date().toLocaleTimeString().grey + " [mdown] - ".grey + message)

    };


    var _message0001 = function(){

        _log("\n");
        _log("be welcome in mdown, my friend. enjoy awesomesauce!".blue);
        _log("watching folder ".blue + process.env.PWD.blue);

    };


    var _message0002 = function(){

        _log("good bye, user".blue);

    };


    var _message0003 = function(){

        _log("this subcommand doesn't exits, try existing: ".red.bold);
        _log("   > mdown create".red.bold + " [create the newest project with configs]".black);
        _log("   > mdown watch".red.bold + " [preview, and autowatch+generate folder]".black);
        _log("   > mdown deploy".red.bold + " [simple deployment to your hosting]".black);
        _log("   > mdown report".red.bold + " [simple info about your PC for bug report]".black);

    };


    var _message0004 = function(){

        _log("sorry but deploy command is not implemented in 0.0.x version".red.bold);

    };
