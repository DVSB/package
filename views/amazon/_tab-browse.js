
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


	// Download Admin Bucket Database and parse to table
	exports.DownloadDatabaseAndParse = function(callback) {

		// From configuration file
		var options = {};
		options.Bucket = rootConf.Amazon.Buckets.AdminBucket;
		options.Key = rootConf.User.ID;

		// Get User Database of all files
		s3.client.getObject(options, function(err, data) {
			if (err) { console.log(err); }			

			// Return array of all items in storage

			callback(JSON.parse(data.Body).items);
						
		});

	}

	exports.UnlinkFile = function(item) {
		
		var options = {};
		
		// Delete real file
		
		options.Bucket = rootConf.Amazon.Buckets.StorageBucket;
		options.Key = item;
		
		s3.client.deleteObject(options, function(err){
			
			if (err) { 
				console.log(err); 
			} else { 
				console.log('is unlinked: ' + item); 
			}
			
		});
		
		// Delete from Database
		
		options.Bucket = rootConf.Amazon.Buckets.AdminBucket;
		options.Key = rootConf.User.ID;
		
		s3.client.getObject(options, function(err, data) {
			if (err) { console.log(err); }
			
			var database = JSON.parse(data.Body).items;	
			
			var databaseWithoutItem = underscore.reject(database, function(iterator){ 
				return iterator.key == item; 
			});
			
			// TODO remove
			console.log('----');
			console.log(databaseWithoutItem);
			
			var jsn = JSON.parse(data.Body.databaseWithoutItem);
			console.log('----');
			console.log(jsn);
						
			options.Body = jsn;
			options.Bucket = rootConf.Amazon.Buckets.AdminBucket;
			options.Key = rootConf.User.ID;
			
			//s3.client.putObject(options, function(err,data){
			//	if (err) { console.log(err); }
			//});
						
		});
		
	}









