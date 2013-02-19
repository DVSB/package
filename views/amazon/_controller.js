
	/*	

	We have two buckets: 
		Admin Bucket
		Storage Bucket

	Admin Bucket contains file per user
		Name of file in Admin Bucket is standard Uniq ID of User
		File is array of all items with details: real name, hash, path, tags, size..

	Storage Bucket contains folders per user like STORAGEBUCKET/C8373990/* 
		C8373990 is uniqid of user and 
		* is unlimited number of files
	
	In file upload:
		Put file to /temp and change name to random hash
		Admin Bucket file: Download, Parse, Add new item, Upload
		Remove file from /tmp

	In file download:
		Check in ABF position of file
		Redirect there

	*/



	// Common libs
	var underscore = require('underscore');
	require('underscore').mixin(require('underscore.string').exports());
	var fs = require('fs');
	

	// File configuration.json from root with all settings 
	var rootConf = JSON.parse(fs.readFileSync('configuration.json'));


	// Amazon SDK API setup
	var AWS = require('aws-sdk');
	AWS.config.update({
		accessKeyId : rootConf.Amazon.Credentials.AccessID,
		secretAccessKey : rootConf.Amazon.Credentials.AccessKey,
		region : rootConf.Amazon.Buckets.Region
	});
	var s3 = new AWS.S3();



	// Runned from app.js
	exports.Init = function(app, req, res) {

		// If sent via POST protocol Form with hidden input 
		if (req.body.svc === 'as87a0d59d4675d7b0d0561c9acc4d04') {
			
			UploadAndUnlink(req, function(fileProperties){
				AddDatabaseItem(fileProperties);
				res.render(__dirname + '/_view.html', {hello : fileProperties});
			});

		} else {
			res.render(__dirname + '/_view.html', {hello : 'Uploadnuty subor uspesne!'});
		}
		
	};


	// Get a file from /temp folder and upload to S3, after unline file
	// Remark: node server saves all files to /temp folder
	function UploadAndUnlink (req, callback) {

		// PUT and GET on S3 requires (1) key, (2) body, (3) bucket
		var options = {};

		// Upload to Storage Bucket
		options.Bucket = rootConf.Amazon.Buckets.StorageBucket;

		// Every user has own folder with flat all files, Key is: folderOfUser/file
		options.Key = rootConf.User.ID + '/' + require('../../app-api').RandomHash();

		// Buffer, file in TMP
		options.Body = fs.readFileSync(req.files.myfile.path);

		// Sent buffer with options to S3 storage
		s3.client.putObject(options, function(err) { 
			if (err) { console.log(err); }

			// Remove uploaded file from /temp
			fs.unlink(req.files.myfile.path);

			// Filtered object with 4 original properties and used uniq hash name
			var fileProperties = underscore.pick(req.files.myfile, 'name', 'type', 'size', 'lastModifiedDate');
			fileProperties.key = options.Key;

			// fileProperties is object with file name, type, size ...
			callback(fileProperties);

		});
		
	}

	// In fileProperties: original name, type, size, lastmodified, key
	// Get database of user from Admin database and add new item
	function AddDatabaseItem(fileProperties) {

		// PUT and GET on S3 requires (1) key, (2) body, (3) bucket
		var options = {};

		// Save database of all files in Admin bucket
		options.Bucket = rootConf.Amazon.Buckets.AdminBucket;

		// Name of file is user ID 
		options.Key = rootConf.User.ID;

		// Get User Database of all files
		s3.client.getObject(options, function(err, data) {
			if (err) { console.log(err); }			

			// Add to fileProperties random tags only for structure
			fileProperties.tags = ['tag1', 'tag2', 'tag3', 'tag4'];

			// Add to original json from s3 Admin bucket next item
			var jsn = JSON.parse(data.Body);
			jsn.items[jsn.items.length] = fileProperties;

			// Upload new bigger Json string directly to Amazon
			options.Body = JSON.stringify(jsn);
			s3.client.putObject(options, function(err,data){
				if (err) { console.log(err); }
			});
			
		});

	}
