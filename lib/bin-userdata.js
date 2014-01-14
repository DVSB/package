

    "use strict";


    module.exports = function() {

        _collectData();

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
