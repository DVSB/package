

	"use strict";


    var boilerplate = require("../lib/boilerplate/plugin");


    var Scanner = function(){

        boilerplate.call(this);

        this.tester();

    };

    require("util").inherits(Scanner, boilerplate);


    Scanner.prototype.tester = function(){

        console.log(this.underscore);

    };

    new Scanner();