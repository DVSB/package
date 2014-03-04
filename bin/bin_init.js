

    "use strict";


    var filesystem = require("fs");
    var log = require("./echo");


    var createEmptyFolders = function(){

        var i = 0;

        function handleFolderErrors(err){
            if (err) {
                log("error -- folder already exists: "+ err.path, true);
                process.kill();
            }
            if (++i===9) fillFoldersWithFiles();
        }

        filesystem.mkdir("./articles", handleFolderErrors);
        filesystem.mkdir("./%templates", handleFolderErrors);
        filesystem.mkdir("./%build", handleFolderErrors);
        filesystem.mkdir("./page", handleFolderErrors);
        filesystem.mkdir("./statics", handleFolderErrors);
        filesystem.mkdir("./articles/1st", handleFolderErrors);
        filesystem.mkdir("./articles/2nd", handleFolderErrors);
        filesystem.mkdir("./articles/3rd", handleFolderErrors);
        filesystem.mkdir("./articles/4th", handleFolderErrors);
    };


    var fillFoldersWithFiles = function(){

        var i = 0;

        function handleFolderErrors(err){
            if (err) {
                log("file already exists: "+ err.path, true);
                process.kill();
            }
            if (++i===13) {
                log("success —- all files created successfully");
                log("type \"downpress run\" and open browser");
            }
        }

        var msg = {};

        var msg1 = "<!-- in this file use classic html -->\n{{ local._content }}";
        var msg2 = "--\ntemplate : article\n---\n\n**hello, i am content of articles!**";
        var msg7 = "--\ntemplate : index\n---\n\n**hello, i am in /index.md!**";
        var msg6 = "--\ntemplate : page\n---\n\n**hello, i am in /page/index.md**";
        var msg4 = "if you will not use '---' meta tags in MD,\nfile is copied only and not parsed";
        var msg3 = "html { background: #ccc }";
        var msg8 = "console.log('hello');";
        var msg5 = "all content in this folder will be removed!! and replaced with build";

        msg.index = "\n\t{{ local._content }}<br>\n";
        msg.index += "\n\t<script src=\"/statics/client.js\"></script>\n";
        msg.index += "\n\t<link href=\"statics/stylesheet.css\" rel=\"stylesheet\" /><br>\n";
        msg.index += "\t<a href=\"/articles/1st/\">1st blog</a><br/>\n";
        msg.index += "\t<a href=\"/articles/2nd/\">2nd blog</a><br/>\n";
        msg.index += "\t<a href=\"/articles/3rd/\">3rd blog</a><br/>\n";
        msg.index += "\t<a href=\"/articles/4th/\">4th blog</a><br/>\n";
        msg.index += "\t<a href=\"/page/\">page</a><br/>\n";

        filesystem.appendFile("./readme.md", msg4, handleFolderErrors);
        filesystem.appendFile("./%templates/index.html", msg.index, handleFolderErrors);
        filesystem.appendFile("./%templates/page.html", msg1, handleFolderErrors);
        filesystem.appendFile("./%templates/article.html", msg1, handleFolderErrors);
        filesystem.appendFile("./%build/build-folder.md", msg5, handleFolderErrors);
        filesystem.appendFile("./page/index.md", msg6, handleFolderErrors);
        filesystem.appendFile("./articles/1st/index.md", msg2, handleFolderErrors);
        filesystem.appendFile("./articles/2nd/index.md", msg2, handleFolderErrors);
        filesystem.appendFile("./articles/3rd/index.md", msg2, handleFolderErrors);
        filesystem.appendFile("./articles/4th/index.md", msg2, handleFolderErrors);
        filesystem.appendFile("./statics/stylesheet.css", msg3, handleFolderErrors);
        filesystem.appendFile("./statics/client.js", msg8, handleFolderErrors);
        filesystem.appendFile("./index.md", msg7, handleFolderErrors);

    };


    createEmptyFolders();



