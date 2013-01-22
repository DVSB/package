
	// Hello!
	// This part of code makes Routing, Error handling, Global requires and Configuration
	
	// To Deploy via Jitsu on Nodejitsu hosting - run 'jitsu deploy'
	// To Push to Github repo on name u200 - run 'git push'
	// To Run with checking file changes - run 'nodemon app.js'
	
	// Layouts:
	//   For index use _layout-index
	//   For views use _layout_view-X
	
	// What happend if screen is loaded?
	//   1. In APP.JS check if view from url is exist
	//   2. If is exist require _controller.js in that folder
	//      (If is not exist, sent 404 error)
	//   3. If its POST, DELETE, PUT - To controller send REQ, RES, APP - Express variables
	//      (If is only GET only read and run controller)
	//   4. In every controller is function INIT()
	//      In this function have to be definiec res.render(url/of/view, object)
	//   5. After is loaded view and rendered with object inside
	
	
	// REQUIRES 
	
		// Base or Core framework
		var express = require('express');
		var app = module.exports = express();
		
		// Very Very important and usefull lib, more on bit.ly/wC89vt
		// Extension for string staff for underscore, more on bit.ly/r1Mkch
		var underscore = require('underscore');
		underscore.mixin(require('underscore.string').exports());
			
		
		
	// CONFIGURATION
		
		app.configure(function(){
		
			'use strict';
		
			// Request body parsing middleware supporting
			app.use(express.bodyParser({ 
				uploadDir: __dirname + '/temp/storage/' 
			}));
			
			// To allow PUT, GET, DELETE and POST
			app.use(express.methodOverride()); 
			
			// To allow cookies
			app.use(express.cookieParser()); 
			
			// Allow middleware and have to be before Sessions 
			// TODO: before cookies too?
			app.use(app.router);	
			
			// All files from /PUBLIC folder can be browsed on /S url
			app.use('/s', express.static(__dirname + '/views/_publics'));
			
			// Set default word 'views' for views folder
			app.set('views', __dirname + '/views');
			
			// Allow EJS engine more on bit.ly/fUkZ1b
			app.engine('html', require('ejs').renderFile);
		
		});
	
	
	// ROUTING
	
		// When browser sents any request (POST, GET..)
		// Browsed URL (localhost/pepek) is available in variable req.params.page
		app.all('/:page', function(req, res) {
		
			'use strict';
		
			// Internal u200API gets array of existing views in /VIEWS folder
			var viewsArray = require('./app-api').ViewsList();
			
			var isExistView = underscore.find(viewsArray, function(item){ 
				return (item===req.params.page); 
			});
			
			// Include controller, else, If browser requests non-exist view in /VIEWS folder send 404 else 
			if (isExistView) {
				require('./views/' + req.params.page +'/_controller.js').Init(app, req, res);
			} else {
				res.send(404, 'you cannot do a get to unexist view!');
			}		
	
		});
		
		// Allow with-dash-started file in view serve on /s/ path
		app.get('/s/-styles.css', function(req, res) {
		
			'use strict';
			
			var currentView = underscore(req.headers.referer).strRightBack('/');
			res.sendfile('./views/' + currentView + '/-styles.css');
			
		});	


		// Allow with-dash-started file in view serve on /s/ path
		app.get('/s/-script.js', function(req, res) {
		
			'use strict';
			
			if (req.headers.referer!==undefined) {
				var currentView = underscore(req.headers.referer).strRightBack('/');	
				res.sendfile('./views/' + currentView + '/-script.js');

			}
			
		});
	
		
		// Routing of index locahost:port
		app.get('/', function(req, res){
		
			'use strict';
		
			// Version is Incremented in deployment process
			// More about versions read in README
			var version = require('./package.json').version;
			res.render('_layout/_layout-index.html', { version : version });		
			
		});	
	
	
	
	// PORT RUN !
	
		if (!module.parent) {
					
			app.listen(4000);
			app.use(express.logger('dev')); // log to console all errors and requests
			
		}	