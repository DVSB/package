module.exports = function(req, res) {

	var s3 = require('../../api/s3')(), cookies=req.signedCookies;
	
	s3.getObject({
		Key : cookies.userid+'/_configuration/user.json'
	}, function(data){
		data = JSON.parse(data.Body+'');
		res.contentType('application/json');
		res.send(data.api.publicKey);
	});


};

