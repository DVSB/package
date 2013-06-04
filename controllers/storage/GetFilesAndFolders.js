// Get files and folders

	exports.GetFilesAndFolders = function(callback) {

		s3.client.listObjects({
			Bucket : settings.amazon.bucket,
			Delimiter : '/',
			Prefix : settings.user.userId + '/'
		}, function(err, data){

			if (err) { console.log(err); }
			
			var crypto = require('crypto');

			var filesAndFolders = data.Contents.concat(data.CommonPrefixes);
			
			// Concat correctlly objects and fill blank keys
			for (var i=0; i<=filesAndFolders.length-1; i++) {
				
				if (filesAndFolders[i].Key) {
					var hash = crypto.createHash('sha512').update(filesAndFolders[i].Key).digest('hex').substr(0, 10);
				} else {
					var hash = crypto.createHash('sha512').update(filesAndFolders[i].Prefix).digest('hex').substr(0, 10);
				}
				
				// If Key, Size and LastModified don't exist add it
				filesAndFolders[i] = underscore.defaults(filesAndFolders[i], {
					'Key' : filesAndFolders[i].Prefix,
					'Size' : 0,
					'LastModified' : 0,
					'Format' : '----------------------------------------------------',
					'Hash' : hash
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
