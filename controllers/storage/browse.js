	// Get files and folders

	exports.ListAll = function(callback) {

		s3.client.listObjects({
			Bucket : settings.amazon.bucket,
			Delimiter : '/',
			Prefix : settings.user.userId + '/'
		}, function(err, data){

			if (err) { console.log(err); }

			var filesAndFolders = data.Contents.concat(data.CommonPrefixes);
			//var hash = 'i havent hash';
			
			// Concat correctlly objects and fill blank keys
			for (var i=0; i<=filesAndFolders.length-1; i++) {

				console.log(hash);
				var hash = crypto.createHash('sha512').update(filesAndFolders[i].Key).digest('hex').substr(0, 8);
				console.log(hash);
			
				// If Key, Size and LastModified don't exist add it
				filesAndFolders[i] = underscore.defaults(filesAndFolders[i], {
					'Key' : filesAndFolders[i].Prefix,
					'Size' : 0,
					'LastModified' : 0,
					'Format' : '----------------------------------------------------',
					'Hash' : 's'
				});
			
				// If Owner, ETag, StorageClass, Prefix exist, remove it
				filesAndFolders[i] = underscore.omit(filesAndFolders[i], [
					'Owner', 
					'ETag', 
					'StorageClass', 
					'Prefix'
				]);
				
				// convert date to 2013/12/5
				var mydate = new Date(filesAndFolders[i].LastModified);
				filesAndFolders[i].LastModified = mydate.getTime();

			}
			
			// first current folder, second folders, third files
			filesAndFolders = underscore.sortBy(filesAndFolders, function(key){ 
				return key.Size;
			});
			
			console.log(filesAndFolders);
			callback(filesAndFolders);

		});
		
	}

// Unlink Objects

	exports.UnlinkObject = function(items, callback) {

		var params = {
			Bucket : settings.amazon.bucket,
			Key : items
		};
		
		s3.client.deleteObject(params, function(err){
			if (err) { console.log(err); }
			callback();
		});

	};
	
// Check current folder base on URL and after make listing
	
	exports.CheckCurrentFolder = function(req, callback){
			
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
