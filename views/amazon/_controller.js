	

	var underscore = require('underscore');
	underscore.mixin(require('underscore.string').exports());

	var AWS = require('aws-sdk');
	var fs = require('fs');
	
	AWS.config.update({
		accessKeyId : 'AKIAIOUHQOMOBQZP7RAQ',
		secretAccessKey : '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',
		region : 'us-east-1'
	});
	
	var s3 = new AWS.S3();
	
	var options = {};
	options.Bucket = 'fc9cca91802c2f3756a13a85b810e63f';

	

	exports.Init = function(app, req, res) {

		if (req.body.svc === 'as87a0d59d4675d7b0d0561c9acc4d04') {
			
			Upload(req, function(nice){
				console.log(nice);
			});

		}
		
		res.render(__dirname + '/_view.html', {
			hello : 'namornik'
		});
		
	};



	// Return random string from Uniq date, Security string and Random number
	function RandomHash() {
	 
		var hash = underscore.join('qoindqowidnwquidnqwuidnqiwdqwd', underscore.random(10000, 90000), Date.now()); 

		// Make SHA512 and trip to 80 chars
		return require('crypto').createHash('sha512').update(hash).digest('hex').substr(0, 80);	

	}


	// Save to Tmp, Upload to S3, Remove from TMP
	function Upload (req, callback) {

		options.Key = RandomHash();
		options.Body = fs.readFileSync(req.files.myfile.path);

		// File Properties (object) is filtred original request object
		var fileProperties = underscore.pick(req.files.myfile, 'name', 'type', 'size', 'lastModifiedDate');
		fileProperties.key = options.Key;

		// If input is not empty
		if ((req.files.myfile.name==='')&&(req.files.myfile.size===0)) {
			console.log('Sorry, but File Input was empty');
			return;
		}

		// Put object to S3
		s3.client.putObject(options, function(err) {

			// Check errors
			if (err) { console.log(err); } else { console.log('Upload successful!'); }

			// Remove tmp
			fs.unlink(req.files.myfile.path);

			callback(fileProperties);

		});
		
	}





