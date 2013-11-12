module.exports = function(req, res) {

	module = require('url').parse(req.url).path.split('/')[3].split('?')[1];
	module = (module==='') ? null : module;

	switch(module) {

		default:
		require('./default')(req, res);
		break;
	
	};
	
};

