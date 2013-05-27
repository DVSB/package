

	var fs = require('fs');
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
			
			tab.upload.Upload(s3, settings, fs, req, function(){
				tab.browse.ListObjects(s3, settings, function(files) {
					res.render(__dirname + '/_view.html', {myfiles : files});
				});
			});

		} else {
			
			tab.browse.GetFiles(s3, settings, function(listOfFiles) {
				tab.browse.GetFolders(s3, settings, function(listOfFolders) {

					// add listOfFolders to listOfFoldersAndFiles (now its only listOfFiles copy)
					var listOfFoldersAndFiles = listOfFiles;
					for (var i=0; i<=listOfFolders.length-1; i++) {
						listOfFoldersAndFiles.push({
							'Key' : listOfFolders[i],
							'LastModified' : '',
							'Size' : ''
						});
					}
										
					res.render(__dirname + '/_view.html', {myfiles : listOfFoldersAndFiles});
					
				});
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

