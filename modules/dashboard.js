module.exports = function(req, res) {
	
	
	// this module is run only when user is logged and has correct all
	// credentials, if is user here, always should be all comunication
	// checked in every request to prevent hacked cookies and IP adress
	
	
	var cookies = req.signedCookies, getAllArticles, renderArticles, createNew,
	_api = require('./_api')(), s3 = _api.s3, underscore = require('underscore'),
	fingerprint = _api.fingerprint, removeAccount;
	
	
	getAllArticles = function(){

		s3.getObject({
			key : cookies.userid+'/blog-module/_articles.json'
		}, function(data){
			data = JSON.parse(data.Body+'');
			renderArticles(data);
		});
		
	};
	
	
	renderArticles = function(articles){
		
		res.render('dashboard.html', { 
			allArticles : articles 
		});
		
	};
	
	
	createNew = function(articles){
		
		res.send('createanew');
				
	};
	
	
	module = require('url').parse(req.url).path.split('/')[2].split('?')[0];
	module = (module==='') ? null : module;
	
	// routing of URL 
	switch(module) {

		
		case 'new': 
		createNew();
		break;
	
		default:
		getAllArticles();
		break;
		
	};
	

};
