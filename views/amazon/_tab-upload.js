
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



	// Get a file from /temp folder and upload to S3, after unline file
	// Remark: node server saves all files to /temp folder
	exports.UploadAndUnlink = function(req, callback) {

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
	exports.AddDatabaseItem = function(fileProperties) {

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
