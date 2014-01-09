

    // in this file should be all generating of blog

    require('./generate/createconfigs.js')();
    require('./generate/generate.js')();


    var walk = require('./node_library/walk.js')();

    var changes = walk.watchFolder("../web");
    console.log(changes);

    // implement walk function
    // on every change pregenerate web and run this file

    // 1) create necessary configs
    // 2) get all templates and theme
    // 3) get all articles and one by one pregenerate
    // 4) save to _build

    // this is the weekend TODOs
