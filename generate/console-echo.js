

    module.exports = function() {

        var colors = require("colors");
        var dateString = new Date().toLocaleTimeString() + " [mdown] - ";

        console.log("\n");
        console.log(dateString.grey + "watching current folder".green);

    };