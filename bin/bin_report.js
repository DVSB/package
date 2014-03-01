

    "use strict";


    var log = require("./echo");


    console.log("");
    log("report a bug?");
    log("  1: browse website github.com/downpress/package/issues");
    log("  2: copy below infos about your computer and go ahead!");

    console.log("");
    log("versions:");
    log("  node: " + process.versions.node);
    log("  http_parser: " + process.versions.http_parser);
    log("  v8: " + process.versions.v8);
    log("  ares: " + process.versions.ares);
    log("  uv: " + process.versions.uv);
    log("  zlib: " + process.versions.zlib);
    log("  modules: " + process.versions.modules);
    log("  openssl: " + process.versions.openssl);

    console.log("");
    log("details:");
    log("  arch: " + process.arch);
    log("  platform: " + process.platform);
    log("  argv: " + process.argv);
    log("  env.PWD: " + process.env.PWD);
    log("  env.OLDPWD: " + process.env.OLDPWD);
    log("  env._: " + process.env._);
    log("  pid: " + process.pid);
    log("  features.debug: " + process.features.debug);
    log("  features.ipv6: " + process.features.ipv6);
    log("  version openssl: " + process.versions.openssl);

    console.log("");