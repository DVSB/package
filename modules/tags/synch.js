module.exports = function(req, res) {

	var s3 = require('../../api/s3')();
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

		var articleTags = underscore.keys(
			blogcontent['tags']);

		var whatToAdd = underscore.difference(
			futureTags, articleTags);

		var whatToRemove = underscore.difference(
			articleTags, futureTags);

		whatToRemove.forEach(function(ele){
			delete blogcontent['tags'][ele];
		});

		whatToAdd.forEach(function(ele){
			blogcontent['tags'][ele] = '';
		});

		saveToS3newBlog(blogcontent)

	};


	var saveToS3newBlog = function(blogcontent){

		var blogId = blogcontent.blogid;
		var userId = req.signedCookies.publickey;

 		s3.putObject({
 			Key : userId+'/blog/'+blogId,
 			Body : JSON.stringify(blogcontent),
			Bucket : 'api.mdown.co'
 		}, function(){
 			updateDoneCallback();
 		});

	};


	var j = 0;
	var updateDoneCallback = function(){

		j++;
		if(j===allBlogs.length) res.redirect('/tags/');

	}



	getAllBlogs();
	getAllTags();


};

