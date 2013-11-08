module.exports = function(req, res) {


	var getAllArticles = function(){
		
		var mdownapi = require('../../api/mdownapi')();
		var publicUserId = req.signedCookies.publickey;

		mdownapi.getJson('3839164116251', '/blog/3839168825212', function(data){
			renderArticles(data);
		});

	};


	var renderArticles = function(articles){

		var markup = '';

		markup += '<body>\n\n<article>';
		markup += articles.markdown;
		markup += '</article>\n\n</body>';

		console.log(markup);
	
		res.render('privates/template.html', {
			markup : markup,
			stylesheets : markup,
			javascript : markup
		});

	};


	getAllArticles();

	
};
