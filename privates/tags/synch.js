module.exports = function(req, res) {

	console.log('adsdsadsa')


	var mdownapi = require('../../api/mdownapi')();
	var userId = req.signedCookies.publickey;
	var allBlogs;
	var allTags;


	var getAllBlogs = function(){

		mdownapi.getJson(userId, '/all/blogs', function(data){
			allBlogs = data;
			onEndCallback();
		});

	};


	var getAllTags = function(all){

		mdownapi.getJson(userId, '/all/tags', function(data){
			allTags = data;
			onEndCallback();
		});

	};


	var i=0;
	var onEndCallback = function(){

		i++;
		if(i===2) updateAllArticles();

	};


	var updateAllArticles = function(){

		allBlogs.forEach(function(ele, i){
			updateBlogTags(ele);
		});

		res.send('done');

	};


	var updateBlogTags = function(blogid){

		

		

	};



	getAllBlogs();
	getAllTags();

};

