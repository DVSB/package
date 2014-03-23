

    "use strict";


    var Sitemap = function() {

        require("./_Boilerplate").call(this);

        setTimeout((function(){
            this.emit("ready")
        }).bind(this), 1);

    };


    require("util").inherits(Sitemap, require("./_Boilerplate"));


    module.exports = new Sitemap();
