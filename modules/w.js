module.exports = function(req, res) {
	
	
	var render, create;


	render = function(){
		
		var message='';
		
		message += 'localhost:4090/w;browse;\n';
		message += 'localhost:4090/w;website;\n';
		message += 'localhost:4090/w;create;\n';
		
		res.set('content-type', 'text/plain');
		res.send(message);
		
	};		
	
	
	create = function(){
		
		res.render('create.html');
		
	};	


	// get from URL module
	module = require('url').parse(req.url);
	module = module.pathname.split(';')[1];
		
	// routing of URL 
	switch(module) {
		
		case 'create': 
		create();
		break;
		
		case 'verify': 
		//verifyEmail();
		break;
		
		default:
		render();
		break;
		
	};
	
	
};
