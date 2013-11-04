module.exports = function(req, res) {
	
	
	var urlArticle, s3 = require('../../api/s3')(), 
	cookies=req.signedCookies;
	
	urlArticle = require('url').parse(req.url).path.split('/')[3].split('?')[0];
	urlArticle = (urlArticle==='') ? null : urlArticle;
	
	
	downloadConfig = function(){
		
		s3.getObject({
			Key : cookies.userid+'/_configuration/articles.json'
		}, function(data){
			data = JSON.parse(data.Body+'');
			updateConfig(data);
		});
		
	};
	
	
	updateConfig = function(data){
		
		var underscore, findKey, matchedKey;
		underscore = require('underscore');
		
		matchedKey = underscore.findWhere(data, { 'blogid' : urlArticle });
		data = underscore.without(data, matchedKey);
		
		uploadNewConfig(JSON.stringify(data), onEnd);
		
	};
	
	
	uploadNewConfig = function(data, callback){
		
		s3.putObject({
			Key : cookies.userid+'/_configuration/articles.json',
			Body : data
		}, function(){
			callback();
		});
		
	};
	
	
	deleteRealBlog = function(callback){
		
		s3.deleteObject({
			Key : cookies.userid+'/blog-module/'+urlArticle
		}, function(){
			callback();
		});
		
	};
	
	var i = 0;
	onEnd = function(){
		i++;
		if(i===2) res.redirect('/-/');
	}
	

	downloadConfig();
	deleteRealBlog(onEnd);
	
	
};

