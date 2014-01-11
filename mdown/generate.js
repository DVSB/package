

    SETTINGS = require('./generate/get-all-settings')();
    USERFILES = require('./generate/get-all-files')();
    THEME = require('./generate/get-theme')();

    // 2) get all templates and theme
    // 3) get all articles and one by one pre-generate
    // 4) save to _build


    require('./generate/create-templates')();


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
