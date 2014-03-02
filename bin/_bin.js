#!/usr/bin/env node


    "use strict";


    global.downpress = {};


    // second CMD argument set by user

    switch (process.argv[2]) {

        case "report" :
            require("./bin_report");
            break;

        case "preview" :
            require("./bin_run");
            break;

        case "run" :
            require("./bin_run");
            break;

        case "init" :
            require("./bin_init");
            break;

        default :
            require("./echo")("error -- use only subcommand: `run`, `init` or `report`", true);
            break;

    }