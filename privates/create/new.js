module.exports = function(req, res) {


	var _s3 = require('../../api/s3')(), cookies=req.signedCookies,
	getArticlesList, _fingerprint = require('../../api/fingerprint')().get,
	uploadListAndBlog, _randomplus = require('../../api/randomplus')();


	getArticlesList = function(){
  
		_s3.getObject({
			Key : cookies.userid+'/_configuration/articles.json'
		}, function(data){
			data = JSON.parse(data.Body+'');
			uploadListAndBlog(data);
		});

	};


	uploadListAndBlog = function(articles){

		var callback, i=0, newArticle, 
		articleId=_randomplus.generate()+'';

		newArticle = {};
		newArticle.blogid = articleId;
		newArticle['tags'] = {
			'title' : req.body.title,
			'published' : req.body.published,
			'author' : req.body.author
		};
		
		articles.unshift(newArticle);
		articles = JSON.stringify(articles);

		callback = function(){
			i++;
			if(i===2) res.redirect('/-/');
		}

		_s3.putObject({
			Key : cookies.userid+'/_configuration/articles.json',
			Body : articles
		}, function(){
			callback();
		});
  
		newArticle = JSON.stringify({
			'blogid' : articleId,
			'markdown' : req.body.markdown,
			'tags' : {
				'title' : req.body.title,
				'published' : req.body.published,
				'author' : req.body.author
			}
		});
	
		_s3.putObject({
			Key : cookies.userid+'/blog-module/'+articleId,
			Body : newArticle
		}, function(){
			callback();
		});

	};


	getArticlesList();


};