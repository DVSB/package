#!/usr/bin/env node
"use strict";

var path = require('path');
var lib = path.join(path.dirname(require('fs').realpathSync(__filename)), '../lib');
require(lib + '/mdown.js')();