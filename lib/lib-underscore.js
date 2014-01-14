

    "use strict";


    var _underscore;


    module.exports = function(func) {

        _loadUnderscore();
        _changeTemplateSettings();

        return _underscore;

    };


    var _loadUnderscore = function(){

        _underscore = require("underscore");
        _underscore.mixin(require("underscore.string").exports());

    };


    var _changeTemplateSettings = function(){

        _underscore.templateSettings = {
            evaluate:    /\{\{#([\s\S]+?)\}\}/g, // {{# console.log("blah") }}
            interpolate: /\{\{[^#\{]([\s\S]+?)[^\}]\}\}/g, // {{ title }}
            escape:      /\{\{\{([\s\S]+?)\}\}\}/g, // {{{ <script> }}}
        };

    };
