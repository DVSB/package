module.exports = function(req, res) {


	var getAllTags = function(){

		var mdownapi = require('../../api/mdownapi')();
		var userId = req.signedCookies.publickey;

		mdownapi.getJson(userId, '/tags', function(data){
			renderScreen(data);
		});

	};


	var renderScreen = function(tags){

		res.render('tags.html', {
			'tags' : tags
		});

	};


	getAllTags();


};
