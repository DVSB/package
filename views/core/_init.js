
	exports.Init = function(req, res) {
				
		if (req.body.svc === 'as87a0d59d') { // If file is uploaded
			
			// in javascript is array object, so this construction of conditional :)
			if (underscore.isArray(req.files.myfile)) {
				// multiupload
				//require('./_tab-upload').Multiupload(s3, settings, req.files.myfile);
			} else {
				// upload
				//require('./_tab-upload').Upload(s3, settings, req.files.myfile);
			}

		} else {
			
			var common = require('./_tab-browse');
			
			common.GetFiles(function(listOfFiles) {
				common.GetFolders(function(listOfFolders) {
					
					console.log(listOfFolders);
					
					/* Create nice folders
					for (var i=0; i<=listOfFolders.length-1; i++) {
	
						var hexFromFolderKey = 'a'; //crypto.createHash('sha512').update(listOfFolders[i]).digest('hex').substr(0, 8);

						listOfFolders[i] = {
							'Key' : listOfFolders[i],
							'Hash' : hexFromFolderKey
						};

					}*/
					
					
					
					// Connect folders and files
					var listOfFoldersAndFiles = listOfFolders.concat(listOfFiles);
					
					console.log(listOfFoldersAndFiles);

					res.render(__dirname + '/_view.html', {myfiles : listOfFoldersAndFiles});

				});
			});
			
		}
		
		if (req.body.button==='unlink') {
			
			//require('./_tab-browse').UnlinkObject(s3, settings, req.body.item, function(){
			//	require('./_tab-browse').ListObjects(s3, settings, function(files) {
			//		res.render(__dirname + '/_view.html', {myfiles : files});
			//	});
			//});
			
		}
		
		if (req.body.button==='rename') {
			console.log('rename');
		}
		if (req.body.button==='move') {
			console.log('move');
		}
		if (req.body.button==='share') {
			console.log('share');
		}
		if (req.body.button==='download') {
			console.log('download');
		}
		if (req.body.button==='copy') {
			console.log('copy');
		}

		
	};

