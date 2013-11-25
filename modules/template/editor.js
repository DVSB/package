module.exports = function(req, res) {


	var getTemplateFiles = function(){

		var mdownapi = require('../../api/mdownapi')();
		var publicUserId = req.signedCookies.publickey;

		mdownapi.getJson(publicUserId, '/template', function(data){
			renderArticles(data);
		});

	};


	var renderArticles = function(obj){
	
		res.render('template.html', {
			template : obj.template,
		});

	};


	getTemplateFiles();

	
};