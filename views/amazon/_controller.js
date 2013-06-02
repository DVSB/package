
	var settings = JSON.parse(fs.readFileSync('settings.json'));
	
	var AWS = require('aws-sdk');
	AWS.config.update({
		accessKeyId : settings.amazon.id,
		secretAccessKey : settings.amazon.key,
		region : settings.amazon.region
	});
	var s3 = new AWS.S3();
	
	var tab = {
		upload : require('./_tab-upload'),
		browse : require('./_tab-browse')
	};


	exports.Init = function(app, req, res) {
		
		if (req.body.svc === 'as87a0d59d') { // If file is uploaded
			
			// in javascript is array object, so this construction of conditional :)
			if (underscore.isArray(req.files.myfile)) {
				// multiupload
				tab.upload.Multiupload(s3, settings, req.files.myfile);
			} else {
				// upload
				tab.upload.Upload(s3, settings, req.files.myfile);
			}

		} else {
			
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

					tab.browse.GetFiles(s3, settings, function(listOfFiles) {
						tab.browse.GetFolders(s3, settings, function(listOfFolders) {
	
							// Create nice folders
							for (var i=0; i<=listOfFolders.length-1; i++) {
			
								var hexFromFolderKey = crypto.createHash('sha512').update(listOfFolders[i]).digest('hex').substr(0, 8);

								listOfFolders[i] = {
									'Key' : listOfFolders[i],
									'Hash' : hexFromFolderKey
								};

							}
	
							// Connect folders and files
							var listOfFoldersAndFiles = listOfFolders.concat(listOfFiles);
	
							res.render(__dirname + '/_view.html', {myfiles : listOfFoldersAndFiles});
	
						});
					});				
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
			
		}
		
		if (req.body.button==='unlink') {
			
			tab.browse.UnlinkObject(s3, settings, req.body.item, function(){
				tab.browse.ListObjects(s3, settings, function(files) {
					res.render(__dirname + '/_view.html', {myfiles : files});
				});
			});
			
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

