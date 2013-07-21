// Check current folder base on URL and after make listing
	
	exports.GetCurrentFolder = function(currentUrl, callback){
			
		var browsingFolders = underscore.trim(currentUrl, '/');
		browsingFolders = underscore.words(browsingFolders, '/');
		browsingFolders = underscore.rest(browsingFolders);
		
		var currentFolder = underscore.last(browsingFolders);
		
		s3.client.listObjects({
			Bucket : settings.amazon.bucket,
			Prefix : settings.user.id + '/',
			Delimiter : '/'
		}, function(err, data){
										
			var folders = data.CommonPrefixes;
			var hash = '';
			var willBeHash = '';
			
			for (var i=0; i<=folders.length-1; i++) {
				
				willBeHash = folders[i].Prefix + settings.user.hash;
				hash = require('crypto').createHash('sha512').update(willBeHash).digest('hex').substr(0, 10);
				
				// if exists currentFolder return it, if not return return blank
				if (hash===currentFolder) {
					callback(folders[i].Prefix);
				} else if ((!currentFolder)&&(i===folders.length-1)) {
					callback(undefined);
				}

			}

		});

	};