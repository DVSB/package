

    module.exports = function(markdownObj) {

        var UNDERS = require("./lib-underscore");
        var theme = require("./lib-cobweb")().theme;

        // Content of %THEME/current mustache formatted
        var currentTemplate = theme[markdownObj.template];

        // Attach object with content of the %THEME folder
        markdownObj.htmlfile = theme;

        // ready HTML with all necessary parsed objects
        return UNDERS.template(currentTemplate, markdownObj);

    };

