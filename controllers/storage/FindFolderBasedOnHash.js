// Check current folder base on URL and after make listing
	
	exports.GetCurrentFolder = function(req, callback){
			
		var browsingUrlFolder = underscore.trim(req.url, '/');
		browsingUrlFolder = underscore(browsingUrlFolder).strRightBack('/');
			
		s3.client.listObjects({
			Bucket : settings.amazon.bucket,
			Delimiter : '/',
			Prefix : settings.user.id + '/' + browsingUrlFolder + '/'
		}, function(err, data){

			console.log(data);
		
			var folderInHash = [];
			for (var i=0; i<=data.CommonPrefixes.length; i++) {
			
				folderInHash[i] = data.CommonPrefixes[i].Prefix;
				folderInHash[i] = underscore.rtrim(folderInHash[i], '/');
				folderInHash[i] = underscore(folderInHash[i]).strRightBack('/');
				var folderName = folderInHash[i];				
				folderInHash[i] = crypto.createHash('sha512').update(folderInHash[i]).digest('hex').substr(0, 8);

			} 
			
			//console.log(folderInHash);

		});

	};
