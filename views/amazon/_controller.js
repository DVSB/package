	

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

	


	// Return random string from Uniq date, Security string and Random number
	function RandomHash() {
	 
	 	// hash is joined more strings: date, random and hash
		var hash = underscore.join('qoindqowidnwquidnqwuidnqiwdqwd', underscore.random(10000, 90000), Date.now()); 

		// Make SHA512 and trip to 80 chars
		return require('crypto').createHash('sha512').update(hash).digest('hex').substr(0, 80);	

	}





	exports.Init = function(app, req, res) {

		if (req.body.svc === 'as87a0d59d4675d7b0d0561c9acc4d04') {
			
			Upload(req, function(nice){
				
				console.log(nice);

				res.render(__dirname + '/_view.html', {
					hello : 'Uploadnuty subor uspesne!'
				});

			});

		}
		
	};


	function SaveToDb(fileProperties) {

		// Connect to Admin Bucket
		options.Bucket = 'fc9cca91802c2f3756a13a85b810e63f';

		// User Key is generated from Email
		// So we dont need to search AT all users because ID can be again regenerated
		var user = {};
		user.key = '99e94779a50efc35a91fee864ceac4c29550ee64bf2a7b57ca42e9bf44483df9d96bab0791f053bf';
	


	}




	// Take a file in TEMP folder, upload to Amazon S3 and Remove him from TEMP
	function Upload (req, callback) {

		// Name of file on S3 is random hash key
		options.Key = '4d0e73aa16e764f1dee37a7f9334e9831048fddda32cdad03099a7723a09cfd8f005bb4488aa6c84/' + RandomHash();

		// Buffer, file in TMP
		options.Body = fs.readFileSync(req.files.myfile.path);

		// fileProperties (object) is filtered original request object width name, type, size ..
		var fileProperties = underscore.pick(req.files.myfile, 'name', 'type', 'size', 'lastModifiedDate');

		// add to fileProperties also key, what is random hash and real name on S3
		fileProperties.key = options.Key;

		// If input is empty, finish this function, if not go to next function
		if ((req.files.myfile.name==='')&&(req.files.myfile.size===0)) {
			console.log('Sorry, but File Input was empty');
			return;
		}

		// Sent buffer with options to S3 storage
		s3.client.putObject(options, function(err) {

			// Check errors
			if (err) { console.log(err); } else { console.log('Upload successful!'); }

			// Remove tmp
			fs.unlink(req.files.myfile.path);

			// fileProperties is object with file name, type, size ...
			callback(fileProperties);

		});
		
	}





