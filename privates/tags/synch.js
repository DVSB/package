module.exports = function(req, res) {


	var mdownapi = require('../../api/mdownapi')();
	var userId = req.signedCookies.publickey;
	var underscore = require('underscore');
	
	var allBlogs;
	var futureTags;


	var getAllBlogs = function(){

		mdownapi.getJson(userId, '/all/blogs', function(data){
			allBlogs = data;
			onEndCallback();
		});

	};


	var getAllTags = function(all){

		mdownapi.getJson(userId, '/all/tags', function(data){
			futureTags = data;
			onEndCallback();
		});

	};


	var i=0;
	var onEndCallback = function(){

		i++;
		if(i===2) updateAllArticles();

	};


	var updateAllArticles = function(){

		console.log('what should be there - new tags');
		console.log(futureTags);
		console.log('..');

		allBlogs.forEach(function(ele, i){
			updateOneBlogTags(ele);
		});

	};


	var updateOneBlogTags = function(blogid){

		mdownapi.getJson(userId, '/blog/'+blogid, function(data){
			compareAndEditTags(data);
			updateDoneCallback();
		});

	};


	var compareAndEditTags = function(blogcontent){

		var articleTags = underscore.keys(blogcontent.tags);
		
		console.log('articletags now:');
		console.log(articleTags);
		console.log('..');

		var whatToAdd = underscore.difference(
			futureTags, articleTags);

		var whatToRemove = underscore.difference(
			articleTags, futureTags);

		console.log(whatToAdd);
		console.log(whatToRemove);
		
		console.log('..');

	};


	var i=0;
	var updateDoneCallback = function(){

		i++;
		if(i===1) res.send('done');

	}



	getAllBlogs();
	getAllTags();


};

