module.exports = function(req, res) {

	
// variables


	var crypto = require('crypto');
	var fs = require('fs');
	var AWS = require('aws-sdk');
	var settings = JSON.parse(require('fs').readFileSync('_settings.json')).settings;	

	AWS.config.update({
		accessKeyId : settings.amazon.id,
		secretAccessKey : settings.amazon.key,
		region : settings.amazon.region
	});
	s3 = new AWS.S3();
	
	
// functions


	var browse = function() {
		
		

		// Get prefix of current folder based on url
		require('./GetCurrentFolder').GetCurrentFolder(req.url, function(currentFolder){
			
			console.log('* Current folder was clicked on ' + currentFolder);
			
			// Get array of Files and Folders sorted, with correct keys and dates
			require('./GetFilesAndFolders').GetFilesAndFolders(currentFolder, function(filesAndFolders){
				var renderedView = __dirname + '/../../views/storage.html';
				res.render(renderedView, {myfiles : filesAndFolders});
			});
			
		});
		

	}; // loginCookies	


// routing and variables


	switch(req.body.action) {
		
		case 'as87a0d59d' :
			console.log('* Upload Model runned');
			
		case 'as87a0d5ad' :
			console.log('* Upload Model runned');

		default :
			var model = require('./storage/_model');
			model.browse(req, res);

	} // switch


};