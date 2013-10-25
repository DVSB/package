module.exports = function(req, res) {
	
	var module, errors={};
	
	module = require('url').parse(req.url).path.split('/')[2].split('?')[0];
	module = (module==='') ? null : module;
	
	errors.e2000 = { 
		error: 'Page not exists', 
		descr: 'Sorry, you not should be here, this page doesnt exists.'
	};
	
	routing = function(number){
		
		var params = {},
		isExists = errors.hasOwnProperty(number);
		
		console.log(isExists);
		
		if (!number || errors.hasOwnProperty(number)) {
			res.redirect('./e2000');
		} else {
			params.error = errors[number].error;
			params.descr = errors[number].descr;
			res.render('errors.html', params);
		}
		
		// routing still is redirecting on different number like exists
		
	}
	
	console.log();
	routing(module);
	
};