module.exports = function(req, res) {


	var getTemplateFiles = function(){

		var mdownapi = require('../../api/mdownapi')();
		var publicUserId = req.signedCookies.publickey;

		var i=0, obj={};
		var onEndCallback = function(markup, stylesheets, javascript){
			if(markup) { obj.markup = markup.content; }
			if(stylesheets) { obj.stylesheets = stylesheets.content; }
			if(javascript) { obj.javascript = javascript.content; }
			i++;
			if(i===3) renderArticles(obj);
		}
		
		mdownapi.getJson(publicUserId, '/template/markup.json', function(markup){
			onEndCallback(markup, null, null);
		});

		mdownapi.getJson(publicUserId, '/template/stylesheets.json', function(stylesheets){
			onEndCallback(null, stylesheets, null);
		});

		mdownapi.getJson(publicUserId, '/template/javascript.json', function(javascript){
			onEndCallback(null, null, javascript);
		});

	};


	var renderArticles = function(obj){
	
		res.render('privates/template.html', {
			markup : obj.markup,
			stylesheets : obj.stylesheets,
			javascript : obj.javascript
		});

	};


	getTemplateFiles();

	
};
