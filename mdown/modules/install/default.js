module.exports = function(req, res) {

    var filesystem = require('fs');

    filesystem.mkdirSync('web');
    filesystem.mkdirSync('web/_settings');
    filesystem.mkdirSync('web/_build');
    filesystem.mkdirSync('web/assets');
    filesystem.mkdirSync('web/content');

    res.send('Installation Done!');

};