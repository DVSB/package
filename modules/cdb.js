module.exports = function(req, res) {
	
	
	saveCookies = function(){
		
		res.send('das');
		return;
		
	}
	
	module = require('url').parse(req.url);
	module = module.pathname.split('/')[2];
	 
	switch(module) {
		
		default:
		saveCookies();
		break;
		
	};
	
	
};

