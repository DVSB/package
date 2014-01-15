

    "use strict";


    module.exports = function(command) {

        switch (command) {

            case "create" :
                // _create();
                // require("./cmnd-create")();
                break;

            case "deploy" :
                // require("../lib/echo")("0004");
                // require("./cmnd-deploy")();
                break;

            case "watch" :
                require("../lib/echo")("0005");
                require("./cmnd-watch").initialization();
                break;

            case "report" :
                // require("cmnd-report")();
                break;

            default :
                require("../lib/echo")("0003");
                break;

        }

    };