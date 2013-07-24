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


	var Multiupload = function(files) {

		for (var i=0; i<=files.length-1; i++) {
		
			var file = files[i];
		
			s3.client.putObject({
				Key : settings.user.id + '/' + file.name,
				Body : fs.readFileSync(file.path)
			}, function(err, data){
				if (err) { console.log(err); } else { 
					fs.unlink(file.path);
				}
			});
		
		}

	}; // Multiupload
	

	var Upload = function(file) {

		s3.client.putObject({
			Key : settings.user.id + '/' + file.name,
			Body : fs.readFileSync(file.path)
		}, function(err, data) {
			if (err) { console.log(err); } else { 
				fs.unlink(file.path);
			}
			
		});

	}; // Upload


	var DefaultUpload = function(req, res) {

		// test isArray is correct because in js array is also object
		if (underscore.isArray(req.files.myfile)) {
			require('./ObjectMultiupload').Multiupload(req.files.myfile);
		} else {
			require('./ObjectUpload').Upload(req.files.myfile);
		}

	}; // DefaultUpload




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
			res.render(__dirname+'/../views/upload.html');
			break;

	} // switch


};