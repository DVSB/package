#!/usr/bin/env node


    "use strict";


    global.downpress = {};


    // a second argument is set by user in terminal

    switch (process.argv[2]) {

        case "report" :
            require("./bin_report");
            break;

	    case "help" :
		    require("./bin_help");
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
