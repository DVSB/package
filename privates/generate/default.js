module.exports = function(req, res) {


	var underscore = require('underscore');
	var blogcontent = {};
	var mdownapi = require('../../api/mdownapi')();
	var userId = req.signedCookies.publickey;


	var getAllApiJsons = function(){

		getListOfBlogs();
		getAllTags();

	};


	var getListOfBlogs = function(){

		mdownapi.getJson(userId, '/all/blogs', function(blogs){
			blogs.forEach(getBlog);
			blogcontent.blogs = blogs;
			howLongWait = blogs.length+2;
			onEndCallback();
		});
		
	};


	blogcontent.blog = [];
	var getBlog = function(ele, i){

		mdownapi.getJson(userId, '/blog/'+ele, function(blog){
			blogcontent.blog[i] = blog;
			onEndCallback();
		});

	};


	var getAllTags = function(ele, i){

		mdownapi.getJson(userId, '/all/tags', function(tags){
			blogcontent.tags = tags;
			onEndCallback();
		});

	};


	var i=0, howLongWait = 0;
	var onEndCallback = function(){

		i++;
		if(i===howLongWait) {
			getTemplate();
		}

	};


	var getTemplate = function(){

		mdownapi.getJson(userId, '/template', function(tmpt){
			createAndUploadTemplate(tmpt.template);
		});

	};


	var createAndUploadTemplate = function(data){

		var s3 = require('../../api/s3')();
		
		data = underscore.template(data, { 
			tags : blogcontent.tags,
			type : 'index', 
			isArchive : false, isBlog : false, isIndex : true, 
			blog : blogcontent.blog, blogs : blogcontent.blogs
		});

		s3.putObject({
 			Key : userId+'/html/index',
 			Body : JSON.stringify(data),
			Bucket : 'api.mdown.co'
 		}, function(){
 			res.redirect('/-/');
 		});

	};


	getAllApiJsons();


};



