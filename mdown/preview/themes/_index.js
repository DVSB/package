module.exports = function(req, res) {

	var action = require('url').parse(req.url).path.split('/')[1].split('?')[1];
	action = (action==='') ? null : action;

	switch(action) {
		
		default:
		require('./default')(req, res);
		break;
	
	}
	
};
