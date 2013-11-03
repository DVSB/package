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
		articleId=_randomplus.generate();

		newArticle = {};
		newArticle.blogid = articleId;
		newArticle.title = req.body.title;
		newArticle.publised = req.body.published;
		newArticle.author = req.body.author;
		newArticle.category = req.body.category;

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
			'title' : req.body.title,
			'publised' : req.body.publised,
			'author' : req.body.author,
			'category' : req.body.category,
			'markdown' : req.body.markdown
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