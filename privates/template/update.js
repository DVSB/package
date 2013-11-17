module.exports = function(req, res) {


	var updateTemplate = function(){

		var s3 = require('../../api/s3')();
		var publicUserId = req.signedCookies.publickey;
		var template = req.body.template;

 		s3.putObject({
 			Key : publicUserId+'/template',
 			Body : JSON.stringify({ 'template' : template }),
			Bucket : 'api.mdown.co'
 		}, function(){
 			res.redirect('./?editor');
 		});

	};


	updateTemplate();

	
};
