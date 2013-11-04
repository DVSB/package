module.exports = function(req, res) {
	
	
	var getAllArticles, renderArticles, createNew,
	_s3 = require('../../api/s3')(),
	_email = require('../../api/email')();
	
	 	
	getAllArticles = function(){
		
		var cookies=req.signedCookies;
		
		_s3.getObject({
			Key : cookies.userid+'/_configuration/articles.json'
		}, function(data){
			data = JSON.parse(data.Body+'');
			renderArticles(data);
		});
		
	};
	
	
	renderArticles = function(articles){
				
		res.render('privates/dashboard.html', {
			'articles' : articles
		});
		
	};
	
	
	createNew = function(articles){
		
		res.send('createanew');
				
	};
	
	
	getAllArticles();
	
	
};
