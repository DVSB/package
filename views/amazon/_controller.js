
	/*	

	We have two buckets: 
		Admin Bucket
		Storage Bucket

	Admin Bucket contains file per user
		Name of file in Admin Bucket is standard Uniq ID of User
		File is array of all items with details: real name, hash, path, tags, size..

	Storage Bucket contains folders per user like STORAGEBUCKET/C8373990/* 
		C8373990 is uniqid of user and 
		* is unlimited number of files
	
	In file upload:
		Put file to /temp and change name to random hash
		Admin Bucket file: Download, Parse, Add new item, Upload
		Remove file from /tmp

	In file download:
		Check in ABF position of file
		Redirect there

	*/




	var tab = {};
	tab.upload = require('./_tab-upload');
	tab.browse = require('./_tab-browse');
	
	

	// Runned from app.js
	exports.Init = function(app, req, res) {

		if (req.body.svc === 'as87a0d59d') { // If file is uploaded
			
			tab.upload.UploadAndUnlink(req, function(fileProperties){
				tab.upload.AddDatabaseItem(fileProperties);
				res.render(__dirname + '/_view.html', {hello : fileProperties});
			});

		} else if (req.body.svc === '4675d7b0d0') {

			tab.browse.DownloadDatabaseAndParse();

		} else if (req.body.svc === 'bb87a0da8a') {
			
			tab.browse.UnlinkFile(req.body.item);
			
		}

		tab.browse.DownloadDatabaseAndParse(function(files){
			res.render(__dirname + '/_view.html', {hello : files});
		});
		

		
	};












