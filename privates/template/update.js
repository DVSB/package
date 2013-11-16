module.exports = function(req, res) {


	var updateTemplate = function(){

		var s3 = require('../../api/s3')();
		var publicUserId = req.signedCookies.publickey;

		var toUpload = {};

		toUpload.pregenerate = { 'content' : req.body.pregenerate };
		toUpload.markup = { 'content' : req.body.markup };
		toUpload.stylesheets = { 'content' : req.body.stylesheets };
		toUpload.javascript = { 'content' : req.body.javascript };

		console.log(toUpload);

 		s3.putObject({
 			Key : publicUserId+'/template/'+req.body.type,
 			Body : JSON.stringify(toUpload),
			Bucket : 'api.mdown.co'
 		}, function(){
 			res.redirect('./?'+req.body.type);
 		});

	};


	updateTemplate();

	
};
