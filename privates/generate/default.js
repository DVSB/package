module.exports = function(req, res) {


	var mdownapi = require('../../api/mdownapi')();
	var publicUserId = req.signedCookies.publickey;
	var underscore = require('underscore');


	var getTemplateFiles = function(){

		mdownapi.getJson(publicUserId, '/template/index', function(data){
			parseEjs(data);
		});

	};


	var parseEjs = function(data){

		var markup = data.markup.content;
		
		mdownapi.getJson(publicUserId, '/all/blogs', function(allblogs){
			
			markup = underscore.template(
				markup, { blogs:allblogs }
			);

			res.send(markup);

		});

	};


	var getAllArticles = function(){

		// <li><a href="url" title="">text</a></li>

		var createMarkup = function(articles){

			var htmlList = [];

			articles.forEach(function(ele, i){
				htmlList[i]  = '<li><a href="/';
				htmlList[i] += ele.blogid;
				htmlList[i] += '" title="';
				htmlList[i] += ele.tags.title;
				htmlList[i] += '">';
				htmlList[i] += ele.tags.title;
				htmlList[i] += '</a></li>';
			});

			res.send(articles);
		}

		mdownapi.getJson(publicUserId, '/blogs/full', function(json){
			createMarkup(json);
		});

	};


	getTemplateFiles();


};
