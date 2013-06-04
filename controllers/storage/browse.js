

	exports.GetFolders = function(callback) {
		
		var fs = require('fs');
		
		var settings = JSON.parse(fs.readFileSync('settings.json'));

		var AWS = require('aws-sdk');
		AWS.config.update({
			accessKeyId : settings.amazon.id,
			secretAccessKey : settings.amazon.key,
			region : settings.amazon.region
		});
		var s3 = new AWS.S3();

		s3.client.listObjects({
			Bucket : settings.amazon.bucket,
			Delimiter : '/',
			Prefix : settings.user.userId + '/'
			//Prefix : settings.user.userId + '/' + settings.amazon.currentFolder + '/'
		}, function(err, data){
					
			if (err) { console.log(err); }
			
			// convert amazon object to simple array for files
			var listOfFolders = [];
			for (var i=0; i<=data.CommonPrefixes.length-1; i++) {
				listOfFolders[i] = data.CommonPrefixes[i].Prefix;
			}
			
			// remove prefix and preserve key names
			for (var i=0; i<=listOfFolders.length-1; i++) {
				listOfFolders[i] = underscore.words(listOfFolders[i], "/");
				listOfFolders[i] = listOfFolders[i][listOfFolders[i].length-1];
			}
			
			callback(listOfFolders);
		});

	};
	
	
	exports.GetFiles = function(callback) {
		
		var fs = require('fs');
		
		var settings = JSON.parse(fs.readFileSync('settings.json'));

		var AWS = require('aws-sdk');
		AWS.config.update({
			accessKeyId : settings.amazon.id,
			secretAccessKey : settings.amazon.key,
			region : settings.amazon.region
		});
		var s3 = new AWS.S3();
		

		//console.log(settings.user.userId + '/' + settings.amazon.currentFolder + '/');

		s3.client.listObjects({
			Bucket : settings.amazon.bucket,
			Delimiter : '/',
			Prefix : settings.user.userId + '/'
			//Prefix : settings.user.userId + '/' + settings.amazon.currentFolder + '/'
		}, function(err, data){
		
			if (err) { console.log(err); }
			
			// convert date to 2013/12/5
			var listOfFiles = data.Contents;
			for (var i=0; i<=data.Contents.length-1; i++) {
				var mydate = new Date(data.Contents[i].LastModified);
				listOfFiles[i].LastModified = mydate.getFullYear() + '/' + mydate.getMonth() + '/' + mydate.getDay();
			}
			
			// omit unnecessary amazon object's keys
			for (var i=0; i<=listOfFiles.length-1; i++) {
				listOfFiles[i] = underscore.omit(listOfFiles[i], 'Owner', 'ETag', 'StorageClass');
			}

			// omit in Key string path and return only Key without "/"
			for (var i=0; i<=listOfFiles.length-1; i++) {				
				listOfFiles[i].Key = underscore(listOfFiles[i].Key).strRight('/');
			}
						
			// remove self-folder submited by amazon
			listOfFiles = underscore.rest(listOfFiles);
						
			callback(listOfFiles);
		});

	};


	exports.UnlinkObject = function(s3, settings, items, callback) {

		var params = {
			Bucket : settings.amazon.bucket,
			Key : items
		};
		
		s3.client.deleteObject(params, function(err){
			if (err) { console.log(err); }
			callback();
		});

	};
	
	
	
	exports.CheckCurrentFolder = function(settings, req, callback){
		
		var crypto = require('crypto');
		
		var browsingUrlFolder = underscore.trim(req.url, '/');
		browsingUrlFolder = underscore(browsingUrlFolder).strRightBack('/');
	
		s3.client.listObjects({
			Bucket : settings.amazon.bucket,
			Delimiter : '/',
			Prefix : settings.user.userId + '/'
		}, function(err, data){
							
			function jumpHere(browsingUrlFolder) {
			
				settings.amazon.currentFolder = browsingUrlFolder;

				
			} // end of function
				
			var folderInHash = [];
			for (var i=0; i<=data.CommonPrefixes.length; i++) {
			
				folderInHash[i] = data.CommonPrefixes[i].Prefix;
				folderInHash[i] = underscore.rtrim(folderInHash[i], '/');
				folderInHash[i] = underscore(folderInHash[i]).strRightBack('/');
				var folderName = folderInHash[i];				
				folderInHash[i] = crypto.createHash('sha512').update(folderInHash[i]).digest('hex').substr(0, 8);
			
				// when browsed folder is find
				if (browsingUrlFolder===folderInHash[i]) {
					jumpHere(folderName);
				} // end of if
			
			} // end of for

		});
		
		
	};
