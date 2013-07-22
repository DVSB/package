module.exports = function(req, res) {


// variables


	var crypto = require('crypto');
	var fs = require('fs');
	var AWS = require('aws-sdk');
	var settings = JSON.parse(require('fs').readFileSync('_settings.json'));	
	
	
// functions


	var Multiupload = function(files) {

		for (var i=0; i<=files.length-1; i++) {
		
			var file = files[i];
		
			s3.client.putObject({
				Bucket : settings.amazon.bucket,
				Key : settings.user.id + '/' + file.name,
				Body : fs.readFileSync(file.path)
			}, function(err, data){
				if (err) { console.log(err); } else { 
					fs.unlink(file.path);
				}
			});
		
		}

	}; // Multiupload


	var Unlink = function(items, callback) {

		var params = {
			Bucket : settings.amazon.bucket,
			Key : items
		};
		
		s3.client.deleteObject(params, function(err){
			if (err) { console.log(err); }
			callback();
		});

	}; // Unlink
	

	var Upload = function(file) {

		s3.client.putObject({
			Bucket : settings.amazon.bucket,
			Key : settings.user.id + '/' + file.name,
			Body : fs.readFileSync(file.path)
		}, function(err, data) {
			if (err) { console.log(err); } else { 
				fs.unlink(file.path);
			}
			
		});

	}; // Upload
	

	var GetFilesAndFolders = function(myprefix, callback) {

		console.log(settings.user.id + '/' + myprefix);
	
		if (!myprefix) {
			myprefix = settings.user.id + '/';
		}

		s3.client.listObjects({
			Bucket : settings.amazon.bucket,
			Delimiter : '/',
			Prefix : myprefix
		}, function(err, data){

			if (err) { console.log(err); }
		
			var crypto = require('crypto'),
				filesAndFolders = data.Contents.concat(data.CommonPrefixes),
				hash = '',
				willBeHash = '';
		
			// Concat correctlly objects and fill blank keys
			for (var i=0; i<=filesAndFolders.length-1; i++) {
			
				if (filesAndFolders[i].Key) {
					willBeHash = filesAndFolders[i].Key + settings.user.hash;
					hash = crypto.createHash('sha512').update(willBeHash).digest('hex').substr(0, 10);
				} else {
					willBeHash = filesAndFolders[i].Prefix + settings.user.hash;
					hash = crypto.createHash('sha512').update(willBeHash).digest('hex').substr(0, 10);
				}
			
				// If Key, Size and LastModified don't exist add it
				filesAndFolders[i] = underscore.defaults(filesAndFolders[i], {
					'Key' : filesAndFolders[i].Prefix,
					'Size' : 0,
					'LastModified' : 0,
					'Format' : '----------------------------------------------------',
					'Hash' : hash
				});
		
				// If Owner, ETag, StorageClass, Prefix exist, remove it
				filesAndFolders[i] = underscore.omit(filesAndFolders[i], [
					'Owner', 
					'ETag', 
					'StorageClass', 
					'Prefix'
				]);
			
				// convert date to 2013/12/5
				var mydate = new Date(filesAndFolders[i].LastModified);
				filesAndFolders[i].LastModified = mydate.getTime();

			}
		
			// first current folder, second folders, third files
			filesAndFolders = underscore.sortBy(filesAndFolders, function(key){ 
				return key.Size;
			});
		
			callback(filesAndFolders);

		});
	
	}; // GetFilesAndFolders


	var GetCurrentFolder = function(currentUrl, callback){
			
		var browsingFolders = underscore.trim(currentUrl, '/');
		browsingFolders = underscore.words(browsingFolders, '/');
		browsingFolders = underscore.rest(browsingFolders);
		
		var currentFolder = underscore.last(browsingFolders);
		
		s3.client.listObjects({
			Bucket : settings.amazon.bucket,
			Prefix : settings.user.id + '/',
			Delimiter : '/'
		}, function(err, data){
										
			var folders = data.CommonPrefixes;
			var hash = '';
			var willBeHash = '';
			
			for (var i=0; i<=folders.length-1; i++) {
				
				willBeHash = folders[i].Prefix + settings.user.hash;
				hash = require('crypto').createHash('sha512').update(willBeHash).digest('hex').substr(0, 10);
				
				// if exists currentFolder return it, if not return return blank
				if (hash===currentFolder) {
					callback(folders[i].Prefix);
				} else if ((!currentFolder)&&(i===folders.length-1)) {
					callback(undefined);
				}

			}

		});

	}; // GetCurrentFolder
	
	
	var FindFolderBasedOnHash = function(req, callback){
			
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

	}; // FindFolderBasedOnHash


	var browse = function(req, res) {
		
		// Get prefix of current folder based on url
		GetCurrentFolder(req.url, function(currentFolder){
			
			console.log('* Current folder was clicked on ' + currentFolder);
			
			// Get array of Files and Folders sorted, with correct keys and dates
			GetFilesAndFolders(currentFolder, function(filesAndFolders){
				var renderedView = __dirname + '/../../views/storage.html';
				res.render(renderedView, {myfiles : filesAndFolders});
			});
			
		});

	}; // browse	
	

	var upload2 = function(req, res) {

		// test isArray is correct because in js array is also object
		if (underscore.isArray(req.files.myfile)) {
			require('./ObjectMultiupload').Multiupload(req.files.myfile);
		} else {
			require('./ObjectUpload').Upload(req.files.myfile);
		}

	}; // upload2


	var unlink2 = function(req, res) {

		require('./ObjectUnlink').Unlink(req.body.item, function(){
			//require('./browse').ListObjects(function(files) {
			//	res.render(__dirname + '/viewhtml', {myfiles : files});
			//});
		});

	}; // unlink2


// routing and variables


	switch(req.body.action) {
		
		case 'as87a0d59d' :
			console.log('* Upload Model runned');
			
		case 'as87a0d5ad' :
			console.log('* Upload Model runned');

		default :
			var model = require('./storage/_model');
			browse(req, res);

	} // switch


};