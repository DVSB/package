

    module.exports = function(markdownObj) {

        // Content of %THEME/current mustache formatted
        var currentTemplate = FILES.theme[markdownObj.template];

        // Attach object with content of the %THEME folder
        markdownObj.htmlfile = FILES.theme;

        // ready HTML with all necessary parsed objects
        return underscore.template(currentTemplate, markdownObj);

    };

