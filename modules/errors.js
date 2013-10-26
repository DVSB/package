module.exports = function(req, res) {
	
	var module, errors={};
	
	module = require('url').parse(req.url).path.split('/')[2].split('?')[0];
	module = (module==='') ? null : module;
	
	errors.e200 = { 
		error: 'Page not exists', 
		descr: 'Sorry, you not should be here, this page doesnt exists.'
	};
	
	routing = function(number){
			
		var params = {}, 
		isExists = errors.hasOwnProperty(number);
		isNotDefined = (errors[number]===undefined);
				
		if (!isExists || isNotDefined){
			res.redirect('/errors/e200');
		} else {
			res.render('errors.html', {
				error : errors[number].error,
				descr : errors[number].descr
			});
		}
		
		// routing still is redirecting on different number like exists
		
	}
	
	routing(module);
	
};