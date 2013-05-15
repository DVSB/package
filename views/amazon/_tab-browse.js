

	exports.ListObjects = function(s3, settings, callback) {

		var params = {
			Bucket : settings.amazon.bucket
		};
		
		s3.client.listObjects(params, function(err, data){
			if (err) { console.log(err); }
			
			// convert date to 2013/12/5
			for (var i=0; i<=data.Contents.length-1; i++) {
				console.log(data.Contents[i].LastModified);
				var mydate = new Date(data.Contents[i].LastModified);
				data.Contents[i].LastModified = mydate.getFullYear() + '/' + mydate.getMonth() + '/' + mydate.getDay();
			}
			
			console.log(data.Contents);

			callback(data.Contents);
		});
		
	}


	exports.UnlinkObject = function(s3, settings, items, callback) {

		var params = {
			Bucket : settings.amazon.bucket,
			Key : items
		};
		
		s3.client.deleteObject(params, function(err){
			if (err) { console.log(err); }
			callback();
		});

	}
