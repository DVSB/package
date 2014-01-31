

	"use strict";


	var _underscore = require("underscore");
	_underscore.mixin(require("underscore.string").exports());

	// change teamplate settings for mustache
	_underscore.templateSettings = {
		evaluate:    /\{\{#([\s\S]+?)\}\}/g, // {{# console.log("blah") }}
		interpolate: /\{\{[^#\{]([\s\S]+?)[^\}]\}\}/g, // {{ title }}
		escape:      /\{\{\{([\s\S]+?)\}\}\}/g // {{{ <script> }}}
	};

    module.exports.init = function() {

        return _underscore;

    };
