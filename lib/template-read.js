

    module.exports = function(layout) {

        getCurrentLayout(layout);

    };


    var getCurrentLayout = function(layout) {

        var currentLayout = THEMEFILES[layout];
        //currentLayout.htmlfile = THEMEFILES;

        console.log(currentLayout);

        //var html = underscore.template(currentLayout, currentLayout);
        //console.log( html );

    };


