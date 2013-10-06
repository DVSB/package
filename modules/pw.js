module.exports = function(req, res) {
	
	

	// get from URL module
	module = require('url').parse(req.url);
	module = module.pathname.split(';')[1];
		
	// routing of URL 
	switch(module) {

		case 'save;': 
		save();
		break;
		
		default:
		preview();
		break;
		
	};
	
	
};
