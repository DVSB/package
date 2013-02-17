	

	var underscore = require('underscore');
	underscore.mixin(require('underscore.string').exports());


	// Return random string from Uniq date, Security string and Random number
	function RandomHash() {
	 	// hash is joined more strings: date, random and hash
		var hash = underscore.join('qoindqowidnwquidnqwuidnqiwdqwd', underscore.random(10000, 90000), Date.now()); 
		// Make SHA512 and trip to 80 chars
		return require('crypto').createHash('sha512').update(hash).digest('hex').substr(0, 14);	
	}


	var user.id = '7f33ac3c54c758';

	var AWS = require('aws-sdk');
	var fs = require('fs');
	
	AWS.config.update({
		accessKeyId : 'AKIAIOUHQOMOBQZP7RAQ',
		secretAccessKey : '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',
		region : 'us-east-1'
	});
	
	var s3 = new AWS.S3();
	
	var options = {};

	// 4a3eaa6cd40e24 bucket for files
	// a9c9c0b51a3ed1 bucket for administrators

	exports.Init = function(app, req, res) {

		// File Upload
		if (req.body.svc === 'as87a0d59d4675d7b0d0561c9acc4d04') {
			
			Upload(req, function(fileProperties){
				AddFiletoDB(fileProperties);
				res.render(__dirname + '/_view.html', {hello : fileProperties});
			});

		} else {

			res.render(__dirname + '/_view.html', {hello : 'Uploadnuty subor uspesne!'});

		}
		
	};


	function AddFiletoDB(fileProperties) {

		// Connect to Admin Bucket
		options.Bucket = 'a9c9c0b51a3ed1'; // admin bucket
		options.Key = '7f33ac3c54c758'; // default temp key

		// User Key is generated from Email
		// So we dont need to search AT all users because ID can be again regenerated
		var item = {};
		item.id = fileProperties.key;
		item.name = fileProperties.name;
		item.size = fileProperties.size;
		item.lastModifiedDate = fileProperties.lastModifiedDate;
		item.type = fileProperties.type;
		item.tags = ['tag1', 'tag2', 'tag3', 'tag4'];

		console.log(item);
		console.log('\n\n\n\n');

		s3.client.getObject(options, function(err, data) {
			if (err) throw err;

			var jsn = JSON.parse(data.Body);
			jsn.items[jsn.items.length] = item;

			fs.writeFile('temp/newdb.json', JSON.stringify(jsn), function (err) {
				if (err) throw err;

				fs.readFile('temp/newdb.json', function(err, data) {
					if (err) throw err;

					options.Body = data;

					s3.client.putObject(options, function(err, data) {
						if (err) throw err;
						//fs.unlink('temp/newdb.json');
					});

				});

			});

			
		});

	}


	// Take a file in TEMP folder, upload to Amazon S3 and Remove him from TEMP
	function Upload (req, callback) {

		options.Bucket = '4a3eaa6cd40e24';
		// Name of file on S3 is random hash key
		options.Key = user.id + '/' + RandomHash();

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





