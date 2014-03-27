

    "use strict";


    var OfflineManifest = function() {

        require("../library/_Boilerplate").call(this);

        setTimeout((function(){
            this.emit("ready")
        }).bind(this), 1);

    };


    require("util").inherits(OfflineManifest, require("../library/_Boilerplate"));


    module.exports = function(){
        return new OfflineManifest();
    };