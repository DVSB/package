

    "use strict";


    module.exports = function(){

        var statics, underscore, markdowns, templates, i=0;

        require("../mdls/underscore/export")(function(_underscore){
            underscore = _underscore;
            i++; if (i===5) onEndCallback();
        });

        require("../mdls/create-build/export")(function(){
            i++; if (i===5) onEndCallback();
        });

        require("../mdls/statics/export")(function(_statics){
            statics = _statics;
            i++; if (i===5) onEndCallback();
        });

        require("../mdls/markdowns/export")(function(_markdowns){
            markdowns = _markdowns;
            i++; if (i===5) onEndCallback();
        });

        require("../mdls/templates/export")(function(_templates){
            templates = _templates;
            i++; if (i===5) onEndCallback();
        });

        function onEndCallback(){

            require("../mdls/generate/export")(statics, markdowns, templates, underscore);

            require("../mdls/sitemaps/export")(function(){
                //console.log("sitemap");
            });

            require("../mdls/offline-manifest/export")(function(){
                //console.log("offline manifest");
            });

        }

    };

    // TODO check this for avoiding to callbacks and inheritance
    // http://bit.ly/1a7cYEc


    // TODO convert all these modules to async instead of sync



