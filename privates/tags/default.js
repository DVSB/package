module.exports = function(req, res) {


	var getAllTags(){

		var mdownapi = require('../../api/mdownapi')();
		var userId = req.signedCookies.publickey;

		mdownapi.getJson(userId, '/all/tags', function(data){
			parseEjs(data);
		});

		res.send('hello world');

	}


	getAllTags();


};