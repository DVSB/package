#!/usr/bin/env node

    "use strict";


    var _watchInitialization = function(){

        var options = {
            ignored : /%build/,
            persistent : false,
            interval : 100,
            ignoreInitial : true
        };

        // initial build
        require("./plugins")();

        // watch this folder with options, every 5s, for every change
        require("chokidar").watch("./", options).on("all", function(event, path){
            require("./echo")("event: "+event+": "+path);
            require("./plugins")();
        });

    };

    var _watchLocalhost = function(){

        function errorHandling(e){
            if (e.code==="EADDRINUSE") {
                require("./echo")("port 3008 is already used", true);
            }
        }

        // yes, nodejs is so awesome, that you need only this for server
        // cool right?
        // TODO add optional port setting
        var options = require("connect")().use(require("connect").static("./%build"));
        require("http").createServer(options).listen(3008).on("error", errorHandling);

    };


    var _collectData = function(){

        console.log("   > ------------------------------------  ");
        console.log("   > ");
        console.log("   > do you want report bug? it's simple! ");
        console.log("   > ");
        console.log("   > 1: browse website github.com/ondrek/mdown/issues ");
        console.log("   > 2: copy this information about your computer ");
        console.log("   > 3: describe your problem ");
        console.log("   > ");

        console.log("   > version node: " + process.versions.node);
        console.log("   > version http_parser: " + process.versions.http_parser);
        console.log("   > version v8: " + process.versions.v8);
        console.log("   > version ares: " + process.versions.ares);
        console.log("   > version uv: " + process.versions.uv);
        console.log("   > version zlib: " + process.versions.zlib);
        console.log("   > version modules: " + process.versions.modules);
        console.log("   > version openssl: " + process.versions.openssl);

        console.log("   > version openssl: " + process.versions.openssl);
        console.log("   > arch: " + process.arch);
        console.log("   > platform: " + process.platform);
        console.log("   > argv: " + process.argv);
        console.log("   > env.PWD: " + process.env.PWD);
        console.log("   > env.OLDPWD: " + process.env.OLDPWD);
        console.log("   > env._: " + process.env._);
        console.log("   > pid: " + process.pid);
        console.log("   > features.debug: " + process.features.debug);
        console.log("   > features.ipv6: " + process.features.ipv6);
        console.log("   > version openssl: " + process.versions.openssl);

        console.log("   > ");
        console.log("   > ------------------------------------ ");

    };


    // second CMD argument set by user
    switch (process.argv[2]) {

        case "preview" :
            require("./echo")("welcome in mdown 0.0.20 ~ watching "+process.env.PWD);
            require("./echo")("build (localhost:3008) and dashboard (localhost:3009)".bold);
            _watchLocalhost();
            _watchInitialization();
            break;

        case "deploy" :
            console.log("i am in cmdn-deploy");

        case "report" :
            _collectData();

        case "create" :
            console.log("im in cmdn-create");

        default :
            require("./echo")("you can use only these subcommands: ", true);
            require("./echo")("       preview");
            break;

    }