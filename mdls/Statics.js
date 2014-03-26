

    "use strict";


    /**
     *  Create an object with details of all files in your website
     */
    var Statics = function() {

        require("../library/_Boilerplate").call(this);

        var that = this;

        this.walkFiles(".", function(files){
            that.statics = files;
            that.removeIgnored();
        });

    };


    require("util").inherits(Statics, require("../library/_Boilerplate"));


    /**
     *  Create an object with details of all files in your website
     */
    Statics.prototype.removeIgnored = function() {

	    var templatesDir = "./" + global.downpress.config["dir-templates"];
        var buildDir = "./" + global.downpress.config["dir-build"];

        function isNotDsStore(file){
            return file.indexOf(".DS_Store") <= -1;
        }

        function isNotBuildDir(file){
            return file.indexOf(buildDir)<=-1;
        }

        function isNotTemplatesDir(file){
            return file.indexOf(templatesDir)<=-1;
        }

        this.statics = this.statics.filter(isNotDsStore);
        this.statics = this.statics.filter(isNotTemplatesDir);
        this.statics = this.statics.filter(isNotBuildDir);

        // go to next function and parse all files to objects
        this.parseToFileObjects();

    };


    /**
     *  Parse to Statics Object
     */
    Statics.prototype.parseToFileObjects = function() {

        var that = this;
        var newObj = [];

        this.statics.forEach(function(file, i){

            newObj[i] = {};
            newObj[i]._name = file.substr(file.lastIndexOf("/")+1);
            newObj[i]._extension = file.substr(file.lastIndexOf(".")+1);
            newObj[i]._size = that.fs.statSync(file).size;
            newObj[i]._path = file;
            newObj[i]._uniqid = that.getRandomID();

        });

        // done, everything is ready
        global.downpress.statics = newObj;
        this.emit("ready");

    };


    /**
     *  Generate Uniq ID for files, can be used like uniq identifier on screen
     */
    Statics.prototype.getRandomID = function() {

        var random1 = Math.floor((Math.random()*800000)+100000);
        var random2 = Math.floor((Math.random()*800000)+100000);
        var random3 = Math.floor((Math.random()*800000)+100000);

        return(random1+random2+random3).toString(36);

    };


    module.exports = new Statics();
