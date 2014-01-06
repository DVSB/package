module.exports = function(req, res) {


    var fs = require("fs");


    var getAllFiles = function(dir) {

        var results = [];

        fs.readdirSync(dir).forEach(function(file) {

            file = dir+'/'+file;
            var stat = fs.statSync(file);

            if (stat && stat.isDirectory()) {
                results = results.concat(getAllFiles(file))
            } else results.push(file);

        });

        return results;

    };


    var filterSystemFolders = function(files){

        function isSystemPath(file){

            var positionOfThirdSlash = file.indexOf('/', 7);
            file = file.substr(0, positionOfThirdSlash);

            return [
                '../web/_build',
                '../web/_settings',
                '../web/_theme'
            ].indexOf(file) > -1;

        }

        var i = files.length-1;

        while (i>0) {
            if (isSystemPath(files[i])) files.splice(i, 1);
            i--;
        }

        return files;

    };


    var filterOnlyMarkdowns = function(files){

        var i = files.length-1;

        while (i>=0) {
            var lastTwoLetters = files[i].substr(files[i].length-2);
            var isMarkdown = lastTwoLetters==="md";
            if (!isMarkdown) files.splice(i, 1);
            i--;
        }

        return files;

    };


    var allFiles;
    allFiles = getAllFiles('../web');
    allFiles = filterSystemFolders(allFiles);
    allFiles = filterOnlyMarkdowns(allFiles);

    res.send(allFiles);

};