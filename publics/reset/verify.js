module.exports = function(req, res) {
	
	var verificationKey = require('url').parse(req.url).path.split('/')[3];
	
	res.render('publics/reset.html', {
		show : 'verify',
		key : verificationKey
	});
	
};
