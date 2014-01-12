

    var filesystem = require("fs");
    var underscore = require("underscore");

    underscore.templateSettings = {
        evaluate:    /\{\{#([\s\S]+?)\}\}/g, // {{# console.log("blah") }}
        interpolate: /\{\{[^#\{]([\s\S]+?)[^\}]\}\}/g, // {{ title }}
        escape:      /\{\{\{([\s\S]+?)\}\}\}/g, // {{{ <script> }}}
    };


    module.exports = function(path, data) {

        var markdownArticle = readFileByPath(path);
        var markdownHeader = getMarkdownHeader(markdownArticle);
        var certainLayout = readCertainLayout(markdownArticle.layout);
        var compiledFinalHtml = compileTemplateToHTML(certainLayout, data);

        return compiledFinalHtml;

    };


    var readFileByPath = function(path) {

        var template;
        template = filesystem.readFileSync("../web/" + path);
        template += "";

        return template;

    };

