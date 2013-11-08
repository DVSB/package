module.exports = function(req, res) {


	var getAllArticles = function(){
		
		var mdownapi = require('../../api/mdownapi')();
		var publicUserId = req.signedCookies.publicKey;

		mdownapi.getJson(publicUserId, '/blogs/full.json', function(data){
			renderArticles(data);
		});

	};


	var renderArticles = function(articles){
	
		res.render('privates/dashboard.html', {
			'articles' : articles
		});

	};


	getAllArticles();

	
};
