

    "use strict";


    require("colors");


    module.exports = function(message, isError) {

        var log;

        log = new Date().toLocaleTimeString().grey;
        log += ": ".grey;

        if (isError) {
            log += message.red.bold
        } else {
            log += message.blue.bold;
        }


        console.log(log);

    };

