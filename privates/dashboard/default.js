module.exports = function(req, res) {


	var getAllArticles = function(){
		
		var mdownapi = require('../../api/mdownapi')();
		var publicUserId = req.signedCookies.publickey;

		mdownapi.getJson(publicUserId, '/all/blogs', function(data){
			renderArticles(data);
		});

	};


	var renderArticles = function(articles){

		// later this should load LAST1000 instead of all
		console.log(articles);
	
		res.render('privates/dashboard.html', {
			'articles' : articles
		});

	};


	getAllArticles();

	
};
