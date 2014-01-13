

    module.exports = function() {

        var colors = require("colors");

        console.log("\n");
        console.log(getDate().grey + "welcome in mdown plugin 0.0.8".blue);
        console.log(getDate().grey + "can type ".blue + "npm uninstall mdown".red + " and anytime remove".blue);
        console.log(getDate().grey + "echo \"rm -rf /\"".blue);
        console.log(getDate().grey + "just kidding.. watching current folder".blue);

    };

    function getDate(){

        return new Date().toLocaleTimeString() + " [mdown] - ";

    }