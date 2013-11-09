module.exports = function(req, res) {


	var i=0;
	var onEndCallback = function(){
		i++;
		if(i===3) res.redirect('./');
	};


	var saveNewTemplates = function(){

		var s3 = require('../../api/s3')();
		var publicUserId = req.signedCookies.publickey;
		
 		s3.putObject({
 			Key : publicUserId+'/template/markup.json',
 			Body : JSON.stringify({'content' : req.body.markup}),
			Bucket : 'api.mdown.co'
 		}, function(){
 			onEndCallback();
 		});

 		s3.putObject({
 			Key : publicUserId+'/template/stylesheets.json',
 			Body : JSON.stringify({'content' : req.body.stylesheets}),
			Bucket : 'api.mdown.co'
 		}, function(){
 			onEndCallback();
 		});

 		s3.putObject({
 			Key : publicUserId+'/template/javascript.json',
 			Body : JSON.stringify({'content' : req.body.javascript}),
			Bucket : 'api.mdown.co'
 		}, function(){
 			onEndCallback();
 		});

	};


	saveNewTemplates();

	
};
