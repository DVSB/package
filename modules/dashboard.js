module.exports = function(req, res) {
	
	
	var cookies = req.signedCookies, getAllArticles, renderArticles,
	_api = require('./_api')(), s3 = _api.s3, underscore = require('underscore');
	
	
	getAllArticles = function(){
						
		s3.listObjects({
			prefix : cookies.userid+'/articles/'
		}, function(data){
			articles = data.Contents;
			articles.forEach(function(ele, i){
				articles[i] = underscore.pick(articles[i], 'Key', 'LastModified', 'Size');
				articles[i].Key = articles[i].Key.split('/')[2];
			});
			renderArticles(articles);
		});
		
	};
	
	
	renderArticles = function(articles){
		
		res.render('dashboard.html', { 
			allArticles : articles 
		});
				
	};
	
	
	module = require('url').parse(req.url);
	module = module.pathname.split('/')[2];	
	
	// routing of URL 
	switch(module) {
		
		default:
		getAllArticles();
		break;
		
	};
	

};
