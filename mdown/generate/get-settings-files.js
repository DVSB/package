

    var SETTINGS = {};


    module.exports = function() {

        attachSystemFolders();
        attachUserSettings();

        return SETTINGS;

    };


    var attachUserSettings = function() {

        // TODO add checking if it's really JSON
        // TODO if someone will name file "test.json.json" what will happens?

        var SETTINGS_FOLDER = "../web/%settings";

        var filesystem = require("fs");
        var settingsFiles = filesystem.readdirSync(SETTINGS_FOLDER);
        var newSettingsObject = {};

        settingsFiles.forEach(function(ele, i){

            var configPath = SETTINGS_FOLDER + "/" + ele;
            var jsonContent = filesystem.readFileSync(configPath);
            var parsedContent = JSON.parse(jsonContent+"");
            var clearFileName = ele.split(".json")[0];

            newSettingsObject[clearFileName] = parsedContent;

        });

        // connect two objects into one
        for (var attrname in newSettingsObject) {
            SETTINGS[attrname] = newSettingsObject[attrname];
        }

    };


    var attachSystemFolders = function() {

        SETTINGS._folders = {
            build : "%build",
            settings : "%settings",
            theme : "%theme"
        };

    };




