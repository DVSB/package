module.exports = function(req, res) {
	
	var create;
	
	create = function(){
	
		res.render('register.html');
		
	};
	
	module = require('url').parse(req.url);
	module = module.pathname.split(';')[1];
	
	// routing of URL 
	switch(module) {
		
		case 'create;': 
		create();
		break;
		
		case 'unlink': 
		//unlink();
		break;
		
		default:
		create();
		break;
		
	};
	
	
};
