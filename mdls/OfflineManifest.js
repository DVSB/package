

    "use strict";


    var OfflineManifest = function() {

        require("./_Boilerplate").call(this);

        setTimeout((function(){
            this.emit("ready")
        }).bind(this), 1);

    };


    require("util").inherits(OfflineManifest, require("./_Boilerplate"));


    module.exports = new OfflineManifest();
