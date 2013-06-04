
	// upload one file
	exports.Upload = function(file) {

		s3.client.putObject({
			Bucket : settings.amazon.bucket,
			Key : settings.user.userId + '/' + file.name,
			Body : fs.readFileSync(file.path)
		}, function(err, data) {
			if (err) { console.log(err); } else { 
				fs.unlink(file.path);
			}
			
		});

	};

	// multiupload
	exports.Multiupload = function(files) {

		for (var i=0; i<=files.length-1; i++) {
			
			var file = files[i];
			
			s3.client.putObject({
				Bucket : settings.amazon.bucket,
				Key : settings.user.userId + '/' + file.name,
				Body : fs.readFileSync(file.path)
			}, function(err, data){
				if (err) { console.log(err); } else { 
					fs.unlink(file.path);
				}
			});
			
		}

	};
	
	/* todo:
	we needs to add multipart upload
	this uploads file 5mb parts up to
	http://aws.amazon.com/about-aws/whats-new/2010/11/10/Amazon-S3-Introducing-Multipart-Upload/
	you can controll pause, abort, complete
	its better version for simple uplodate
	IT IS NOT MULTIFILE UPLOAD
	
	var params = {
			Bucket : settings.amazon.bucket,
			Key : settings.user.userId + '/' + 'nannananana'
		};
		
		s3.client.createMultipartUpload(params, function(err, data){
					
			if (err) { console.log('3333: ' + err); }
			console.log(data);
			console.log('---');
			
			for (var i=0; i<=files.length-1; i++) {

				// copy for next function
				var myUploadId = data.UploadId;
				
				// upload first part
				s3.client.uploadPart({
					Bucket : settings.amazon.bucket,
					Key : settings.user.userId + '/' + 'nannananana',
					PartNumber : i+1+'',
					UploadId : data.UploadId,
					Body : fs.readFileSync(files[i].path)
				}, function(err, data){
									
					if (err) { console.log('1212: ' + err); } 
					
					console.log('myUploadId: ' + myUploadId);
					
					s3.client.completeMultipartUpload({
						Bucket : settings.amazon.bucket,
						Key : settings.user.userId + '/' + 'nannananana',
						UploadId : myUploadId
					}, function(err, data){
						console.log('****');
						if (err) { console.log(err); }
						console.log('*****');
					});
					
				});
					
			};

		});
		
	*/