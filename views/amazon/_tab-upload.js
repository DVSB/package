
	// upload one file
	exports.Upload = function(s3, settings, file) {

		console.log('spusteny upload jedneho file');
	
		var params = {
			Bucket : settings.amazon.bucket,
			Key : settings.user.userId + '/' + file.name,
			Body : fs.readFileSync(file.path)
		};

		s3.client.putObject(params, function(err, data) {
			if (err) { console.log(err); } else { console.log(data); }
			fs.unlink(file.path);
		});

	};

	// multiupload
	exports.Multiupload = function(s3, settings, files) {

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
					
					/*					
					if (err) {
						
						var params = {
							Bucket : settings.amazon.bucket,
							Key : settings.user.userId + '/' + 'nannananana',
							UploadId : data.UploadId
						};
						s3.client.abortMultipartUpload(params, function(err, data){
							if (err) { console.log(err); } else { console.log(data); }
							console.log('aborted');
						});
					
					} else {
					*/
						//if (i===files.length-1) {
					
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
					
						//}
						
					//}
					
				});
					
			};

		});

	};
