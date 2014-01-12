

    module.exports = function(markdownObj) {

        // Content of %THEME/current mustache formatted
        var currentTemplate = THEMEFILES[markdownObj.template];

        // Attach object with content of the %THEME folder
        markdownObj.htmlfile = THEMEFILES;

        // ready HTML with all necessary parsed objects
        return underscore.template(currentTemplate, markdownObj);

    };

