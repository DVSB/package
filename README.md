Bee
=======
Bee is an application like alternative to Google API (but better of course).

1. Content
-------
 - Content
 - News
 - Project Structure
 - Routing
 - Dependencies
 - Versions
 - Licence

 
2. News (always read this before code)
-----------------------------------
 - Added this README
 - New Project Structure section here

3. Project Structure
-----------------

**/node_modules/** 
 - This folder contains all dependencies for requires in application
 - Dependencies can be installed with `npm install` from package.json
 - `npm update` will update all dependencies
 
**/package.json**
 - For more http://package.json.jit.su/
 - Nodejitsu (hosting) requires this file
 - `npm install` and `npm update` requires this file
 - Every deployment via `jitsu deploy` increment version
 - Version is included to INDEX of application

**/app.js**
 - Index file
 - Requires all Routing, Listening on port, Global requires, Serving static files
 - Samples of usage https://github.com/visionmedia/express/tree/master/examples
 - In most cases you don't need to modify this file
 - Reads all `/views` and get response on url
 - Serve all `/public/` files to `localhost/s/` url

**/views/**
 - `./_layout-index.html` - Default layout wrapper for INDEX
 - `./_layout-view.html` - Default layout wrapper for VIEW
 - `./view-*/_controller.js` - See category *4. Routing* 
 - `./view-*/_view.html` - See category *4. Routing* 

**/ulib/**
 - u200 libraries
 - Cryptography, Password Hashs
 - Amazon download and upload
 - API for website, GET, POST

**/storage/**
 - Temporary storage for all files
 - Later this file will be moved to Amazon storage

4. Routing
----------
 - If URL `localhost/admin` is browser
 - Run `/views/view-admin/_controller.js`
 - Return from `controller.js` main object
 - Push object to `_view.html `and render screen


5. Dependencies
------------
 - `git clone https://github.com/u200/Bee.git`
 - `http://nodejs.org/download/` Install NodeJs
 - `curl http://npmjs.org/install.sh | sh` Install NPM
 - `npm update` Update a packages
 - `cd Bee` Go into Gee
 - `npm install` NPM download dependencies to node_module
 - `nodemon app.js` Run installed nodemon to run Bee


Boring part:
============


5. Versions
------------
 - Version is in '0.V.S-DD' form, where V is Version, S is Subversion, DD is deployment
 - Every deployment increment DD
 - Every new feature by developer increment Subversion
 - Every new release increment Version

6. Licence
----------
**Copyright 2012, All Rights Reserved**

The website belongs to and is managed by the u200 (hereafter called "we").

You are kindly requested to read the following conditions before using this website, software or parts of code. By using the website, software or parts of code you will automatically accept these conditions. If you do not approve of them then you are requested not to use the website, do not use the code of u200.

It is forbidden to copy, reproduce, print, download, send, fork, transmit or distribute by any means, the material that comes from this or any other site that belongs to or is under the management, concession or control of u200.

For more information contact we@u200.org. For a request to copy, for a download request, for a reuse request. Withuot this permission is not allowed to use any part of code. From original repository or from different repository.