module.exports = function(req, res) {


	var getTemplateFiles = function(){

		var mdownapi = require('../../api/mdownapi')();
		var publicUserId = req.signedCookies.publickey;

		mdownapi.getJson(publicUserId, '/template/page', function(data){
			renderArticles(data);
		});

	};


	var renderArticles = function(obj){
	
		res.render('privates/template.html', {
			pregenerate : obj.pregenerate.content,
			markup : obj.markup.content,
			stylesheets : obj.stylesheets.content,
			javascript : obj.javascript.content,
			type : 'page'
		});

	};


	getTemplateFiles();

	
};