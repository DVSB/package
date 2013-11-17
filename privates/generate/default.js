module.exports = function(req, res) {


	var getTemplateFiles = function(){

		var mdownapi = require('../../api/mdownapi')();
		var publicUserId = req.signedCookies.publickey;

		mdownapi.getJson(publicUserId, '/template', function(data){
			renderIndex(data.template);
			renderBlog(data.template);
			renderArchive(data.template);
		});

	};


	var renderIndex = function(data){

		var underscore = require('underscore');

		data = underscore.template(data, { 
			tag : { date:'', author:'' },
			type : 'samko', 
			isArchive : false, isBlog : false, isIndex : true, 
			blog : '', content : '', blogs : []
		});

		res.send(data);

	};


	var renderBlog = function(data){

		var underscore = require('underscore');

		data = underscore.template(data, { 
			tag : { date:'', author:'' },
			type : 'samko', 
			isArchive : false, isBlog : false, isIndex : true, 
			blog : '', content : '', blogs : []
		});

	};

	
	var renderArchive = function(data){

		var underscore = require('underscore');

		data = underscore.template(data, { 
			tag : { date:'', author:'' },
			type : 'samko', 
			isArchive : false, isBlog : false, isIndex : true, 
			blog : '', content : '', blogs : []
		});

	};


	getTemplateFiles();


};



