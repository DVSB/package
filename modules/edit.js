module.exports = function(req, res) {
	
	var render;
	
	render = function(){
		
		module = require('url').parse(req.url);
		module = module.pathname.split(';')[1];
		
		res.render('edit.html', {
			markdown : ''
		});
		
	}

};
