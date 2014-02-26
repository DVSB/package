

    "use strict";


    module.exports = function(callback){

        callback();

        return;

        var express = require("express");
        var app = express();

        app.configure(function(){
            var dashboardFolder =  __dirname+"/../dashboard/";
            app.use("/s/", express.static(dashboardFolder));
            app.set("views", dashboardFolder);
            app.engine("html", require("ejs").renderFile);
            app.use(express.json());
            app.use(express.urlencoded());
            app.use(express.methodOverride());
            app.use(app.router);
        });

        app.all("/", function(req, res) {
            res.render("index.html", {});
        });

        app.use(express.logger("dev")).listen(3009);

    };
