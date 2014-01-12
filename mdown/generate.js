

    underscore = require('underscore');
    underscore.mixin(require('underscore.string').exports());

    SETTINGS = require('./generate/get-all-settings')();
    USERFILES = require('./generate/get-all-files')();
    THEME = require('./generate/get-theme')();


    require('./generate/create-templates')();

    var rawMd = require('./node_library/parse-md')("about/index.md");
    console.log(rawMd);


    // this is used only in production
    // in development we have nodemon which watchs

    var onAnyChange = function(event, path){
        // console.log(+new Date() + ' > ' + event + ' > ' + path);
        // require('./generate/createconfigs.js')();
        // require('./generate/createtemplates.js')();
    };

    require('chokidar').watch(
        '../web/',
        { ignored: /[\/\\]\./, persistent: true }
    ).on('all', onAnyChange);
