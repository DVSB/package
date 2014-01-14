

    "use strict";


    require("colors");


    module.exports = function(commands) {

        var _2nd = commands[2];

        switch (_2nd) {

            case "create" :
                _create();
                break;

            case "deploy" :
                require("./echo")("0004");
                break;

            case "watch" :
                _watch();
                break;

            case "report" :
                require("./bin-userdata")();
                break;

            default :
                require("./echo")("0003");
                break;

        }

    };


    var _create = function(){

        console.log("here should be functionality of HTML5 boilerplate and normalizers");

    };

    var _watch = function(){

        console.log("TODaO");

    };