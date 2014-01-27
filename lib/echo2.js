

    "use strict";


    require("colors");


    var color = "red";


    module.exports = function(message, isError) {

        var log;

        log = new Date().toLocaleTimeString().grey;
        log += " [mdown] - ".grey;

        if (isError) { log += "error: ".red.bold }
        log += message.blue;

        console.log(log);

    };

