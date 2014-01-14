

    "use strict";


    var _underscore;


    // normal require of underscore for nodejs
    _underscore = require("underscore");

    // connect underscore string into
    _underscore.mixin(require("underscore.string").exports());

    // change teamplate settings for mustache
    _underscore.templateSettings = {
        evaluate:    /\{\{#([\s\S]+?)\}\}/g, // {{# console.log("blah") }}
        interpolate: /\{\{[^#\{]([\s\S]+?)[^\}]\}\}/g, // {{ title }}
        escape:      /\{\{\{([\s\S]+?)\}\}\}/g, // {{{ <script> }}}
    };


    module.exports = _underscore;
