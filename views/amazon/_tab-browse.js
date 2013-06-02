

	exports.GetFolders = function(s3, settings, callback) {

		s3.client.listObjects({
			Bucket : settings.amazon.bucket,
			Delimiter : '/',
			Prefix : settings.user.userId + '/' + settings.amazon.currentFolder + '/'
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
				listOfFolders[i] = listOfFolders[i][1];
			}
			
			callback(listOfFolders);
		});

	};
	
	
	exports.GetFiles = function(s3, settings, callback) {

		s3.client.listObjects({
			Bucket : settings.amazon.bucket,
			Delimiter : '/',
			Prefix : settings.user.userId + '/' + settings.amazon.currentFolder + '/'
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
