module.exports = function(req, res) {

    // node fs
    var filesystem = require('fs');

    // load content of a settings folder
    var settings = filesystem.readdirSync('./web/_settings/');

    // load content of all settings into object
    settings.forEach(function(ele, i){
        var content = filesystem.readFileSync('./web/_settings/'+ele, 'utf8');
        settings[i] = {};
        settings[i].content = JSON.parse(content);
        settings[i].name = ele;
    });

    var newSettings = {};

    // remove json and rename
    settings.forEach(function(ele, i){
        var name = ele.name.split('.json', 1)[0];
        newSettings[name] = ele.content;
    });

    res.send(newSettings);

};