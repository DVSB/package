#!/usr/bin/env node
"use strict";


    // second CMD argument set by user
    switch (process.argv[2]) {

        case "watch" :
            require("../lib/echo")("welcome in mdown 0.0.20 ~ watching "+process.env.PWD);
	        require("../lib/echo")("browse website (localhost:3008) or dashboard (localhost:3009)".bold);
            require("./argv_watch").localhostInit();
            require("./argv_watch").initialization();
            require("./argv_watch").dashboardInit();
            break;

        default :
            require("../lib/echo")("you can use only these subcommands: ", true);
            require("../lib/echo")("       create, watch, deploy, report");
            break;

    }
