

    module.exports = function() {

        getAllTemplates();

    };


    var filesystem = require("fs");
    var underscore = require("underscore");

    underscore.templateSettings = {
        evaluate:    /\{\{#([\s\S]+?)\}\}/g, // {{# console.log("blah") }}
        interpolate: /\{\{[^#\{]([\s\S]+?)[^\}]\}\}/g, // {{ title }}
        escape:      /\{\{\{([\s\S]+?)\}\}\}/g, // {{{ <script> }}}
    };


    var getAllTemplates = function() {

        var indexName = SETTINGS.theme.templates.index;
        var template = filesystem.readFileSync("../web/%theme/"+indexName)+"";
        var compiled = underscore.template(template);

        var userApiWrapper = {
            name: "<script></script>",
            htmlfile : THEME,
            content: "content",
            title : "hello world"
        };

        var afterLayout = compiled(userApiWrapper);
        compiled = underscore.template(afterLayout);
        compiled = compiled(userApiWrapper);

        // console.log( compiled );

    };


