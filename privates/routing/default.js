module.exports = function(req, res) {

	
	var mdownapi = require('../../api/mdownapi')();
	var publicUserId = req.signedCookies.publickey;
	
	
	mdownapi.getJson(publicUserId, '/routing', function(data){
		res.render('privates/routing.html', { rules : data });
	});
	

};