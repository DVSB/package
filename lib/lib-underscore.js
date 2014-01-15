

    "use strict";


    var _underscore;


    // normal require of underscore for nodejs
    _underscore = require("../ext/underscore-1.5.2");

    // connect underscore string into
    _underscore.mixin(require("../ext/undersstring-2.3.3").exports());

    // change teamplate settings for mustache
    _underscore.templateSettings = {
        evaluate:    /\{\{#([\s\S]+?)\}\}/g, // {{# console.log("blah") }}
        interpolate: /\{\{[^#\{]([\s\S]+?)[^\}]\}\}/g, // {{ title }}
        escape:      /\{\{\{([\s\S]+?)\}\}\}/g, // {{{ <script> }}}
    };


    module.exports = _underscore;
