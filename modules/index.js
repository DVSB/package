module.exports = function(req, res) {


// variables


	var crypto = require('crypto');
	var fs = require('fs');
	var AWS = require('aws-sdk');
	var settings = JSON.parse(require('fs').readFileSync('_settings.json')).settings;

	var underscore = require('underscore');
	underscore.mixin(require('underscore.string').exports());
	
	AWS.config.update({ 
		accessKeyId : settings.awsId, 
		secretAccessKey : settings.awsKey, 
		region : settings.region,
		bucket : settings.bucket,
		storage : settings.storage,
		ServerSideEncryption : settings.encrypt
	});
	var s3 = new AWS.S3();


// functions


	var register = function(){}
	
	var login = function(){}
	

// routing and variables


	switch(req.body.action) {
		
		case 'as87a0d59d' :
			console.log('* Upload Model runned');
			break;
			
		case 'as87a0d5ad' :
			console.log('* Upload Model runned');
			break;

		default :
			//DefaultUpload();
			res.render(__dirname+'/../views/_.html');
			break;

	} // switch


};