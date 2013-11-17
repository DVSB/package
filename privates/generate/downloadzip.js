module.exports = function(req, res) {


	var mdownapi = require('../../api/mdownapi')();
	var userId = req.signedCookies.publickey;


	mdownapi.getJson(userId, '/html/index', function(index){
		
		res.setHeader('Content-disposition', 'attachment; filename=index.html');
		res.setHeader('Content-type', 'text/html');
		res.charset = 'UTF-8';
		res.write(index);
		res.end();

	});


};