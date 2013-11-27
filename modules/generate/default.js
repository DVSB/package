module.exports = function(req, res) {


	var underscore = require('underscore');
	var blogcontent = {};
	var mdownapi = require('../../api/mdownapi')();
	var userId = req.signedCookies.publickey;
	var s3 = require('../../api/s3')();


	// get all necessary resources 


		var getListOfBlogs = function(){

			mdownapi.getJson(userId, '/blogs', function(blogs){
				blogs.forEach(getBlog);
				blogcontent.blogs = blogs;
				howLongWait = blogs.length+2; // .length + getBlog + getAllTags
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

			mdownapi.getJson(userId, '/tags', function(tags){
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


	// get templates and save


		var getTemplate = function(){

			mdownapi.getJson(userId, '/template', function(tmpt){
				templateIndex(tmpt.template);
				templateBlog(tmpt.template);
			});

		};


		var templateIndex = function(data){
			
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
	 			//res.redirect('/');
	 		});

		};


		var templateBlog = function(data){

			var allBlogs = blogcontent.blog;
			var i=0;

			function toUpload(blog, title){

				s3.putObject({
		 			Key : userId+'/html/blog-'+title,
		 			Body : JSON.stringify(blog),
					Bucket : 'api.mdown.co'
		 		}, function(){
		 			callbackOnEnd();
		 		});

			};

			function callbackOnEnd(){

				if(i===allBlogs.length-1) {
					res.redirect('/');
				} else i++;

			};

			allBlogs.forEach(function(ele, i){

				data = underscore.template(data, { 
					tags : blogcontent.tags,
					type : 'blog',
					isArchive : false, isBlog : true, isIndex : false, 
					blog : ele, blogs : allBlogs
				});

				toUpload(data, allBlogs[i].blogid);

			});

		};


	// startup


	getListOfBlogs();
	getAllTags();


};



