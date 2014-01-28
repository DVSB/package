#!/usr/bin/env node
"use strict";


    require("../lib/echo")("be welcome in mdown 0.0.20");


    // second CMD argument set by user
    switch (process.argv[2]) {

        case "watch" :
            require("../lib/echo")("watching folder "+process.env.PWD);
            require("./argv_watch").localhostInit();
            require("./argv_watch").initialization();
            break;

        default :
            require("../lib/echo")("you can use only these subcommands: ", true);
            require("../lib/echo")("       create, watch, deploy, report");
            break;

    }


