
	exports.browse = function(req, res) {
	
		// Get prefix of current folder based on url
		require('./GetCurrentFolder').GetCurrentFolder(req.url, function(currentFolder){
			
			console.log('* Current folder was clicked on ' + currentFolder);
			
			// Get array of Files and Folders sorted, with correct keys and dates
			require('./GetFilesAndFolders').GetFilesAndFolders(currentFolder, function(filesAndFolders){
				var renderedView = __dirname + '/../../views/_view.html';
				res.render(renderedView, {myfiles : filesAndFolders});
			});
			
		});
		

		
	};

	exports.upload = function(req, res) {

		// test isArray is correct because in js array is also object
		if (underscore.isArray(req.files.myfile)) {
			require('./ObjectMultiupload').Multiupload(req.files.myfile);
		} else {
			require('./ObjectUpload').Upload(req.files.myfile);
		}

	};


	exports.unlink = function(req, res) {

		require('./ObjectUnlink').Unlink(req.body.item, function(){
			//require('./browse').ListObjects(function(files) {
			//	res.render(__dirname + '/_view.html', {myfiles : files});
			//});
		});

	};