

    "use strict";


    // normal require of underscore for nodejs
    var _underscore = require("underscore-1.5.2.js");

    // connect underscore string into
    _underscore.mixin(require("undersstring-2.3.3.js").exports());

    // change teamplate settings for mustache
    _underscore.templateSettings = {
        evaluate:    /\{\{#([\s\S]+?)\}\}/g, // {{# console.log("blah") }}
        interpolate: /\{\{[^#\{]([\s\S]+?)[^\}]\}\}/g, // {{ title }}
        escape:      /\{\{\{([\s\S]+?)\}\}\}/g, // {{{ <script> }}}
    };


    module.exports = _underscore;
