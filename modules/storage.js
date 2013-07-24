module.exports = function(req, res) {


// variables


	var crypto = require('crypto');
	var fs = require('fs');
	var AWS = require('aws-sdk');
	var settings = JSON.parse(require('fs').readFileSync('_settings.json')).settings;
	
	var underscore = require('underscore');
	underscore.mixin(require('underscore.string').exports());
		
	AWS.config.update({ 
		accessKeyId : settings.awsId, 
		secretAccessKey : settings.awsKey, 
		region : settings.region,
		bucket : settings.bucket
	});
	var s3 = new AWS.S3();

	
// functions


	var Multiupload = function(files) {

		for (var i=0; i<=files.length-1; i++) {
		
			var file = files[i];
		
			s3.client.putObject({
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
			Key : items
		};
		
		s3.client.deleteObject(params, function(err){
			if (err) { console.log(err); }
			callback();
		});

	}; // Unlink
	

	var Upload = function(file) {

		s3.client.putObject({
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
	
	
	var FindFolderBasedOnHash = function(req, callback){
			
		var browsingUrlFolder = underscore.trim(req.url, '/');
		browsingUrlFolder = underscore(browsingUrlFolder).strRightBack('/');
			
		s3.client.listObjects({
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


	var browse = function() {
		
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
	
	
	var GetCurrentFolder = function(currentUrl, callback) {
			
		var browsingFolders = underscore.trim(currentUrl, '/');
		browsingFolders = underscore.words(browsingFolders, '/');
		browsingFolders = underscore.rest(browsingFolders);
		
		var currentFolder = underscore.last(browsingFolders);
		
		AWS.config.update({ 
			accessKeyId : settings.awsId, 
			secretAccessKey : settings.awsKey, 
			region : settings.region,
			bucket : settings.bucket
		});
		var s3 = new AWS.S3();
		
		s3.client.listObjects({
			Bucket : settings.bucket,
			Delimiter : '/'
		}, function(err, data){
			
			if (err) { console.log(err); }
			console.log(data);
										
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
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	
	
	var browseFolder = function(prefix, callback){
				
		s3.client.listObjects({
			Bucket : settings.bucket,
			Delimiter : '/',
			Prefix : prefix
		}, function(err, data){
		
			if (err) { console.log(err); }
						
			// Make Array of Folders
			var allFolders = [];
			data.CommonPrefixes.forEach(function(element, index) {
				allFolders[index] = crypto.createHash('sha512').update(element.Prefix + settings.hash).digest('hex').substr(0, 10);
			});
			
			// Make Array of Files
			var allFiles = [];
			data.Contents.forEach(function(element, index){
				element = underscore.pick(element, 'Key').Key;
				allFiles[index] = crypto.createHash('sha512').update(element + settings.hash).digest('hex').substr(0, 10);
			});
							
			res.send({
				files : underscore.rest(allFiles),
				folders : allFolders
			});
		
		}); // s3
	
	} // browseFolder
	
		
	var findFolder = function(callback){
		
		var prefix = '';
		
		var foldersFromUrl = underscore.trim(req.url, '/');
		foldersFromUrl = underscore.words(foldersFromUrl, '/');
		foldersFromUrl = underscore.rest(foldersFromUrl);
		
		var getCurrentFolder = function(iterator, prefix, callback){
									
			var iteratingFolder = foldersFromUrl[iterator];
			
			// isLast
			if (foldersFromUrl.length==iterator){
				browseFolder(prefix, 0);
				return;
			}
				
			s3.client.listObjects({
				Bucket : settings.bucket,
				Delimiter : '/',
				Prefix : prefix ? prefix : settings.home+'/'
			}, function(err, data){
		
				if (err) { console.log(err); }
					
				var hashedElement;
				var unhashedFolder;
				data.CommonPrefixes.forEach(function(element, index){
					unhashedFolder = element.Prefix;
					hashedFolder = crypto.createHash('sha512').update(unhashedFolder + settings.hash).digest('hex').substr(0, 10);
					var isEql = hashedFolder===iteratingFolder;
					isEql ? getCurrentFolder(++iterator, element.Prefix) : false;
				});
		
			}); // s3
	
		} // getChildren
		
		getCurrentFolder(0);
		
	} // findFolder


// routing and variables


	switch(req.body.action) {
		
		case 'as87a0d59d' :
			console.log('* Upload Model runned');
			
		case 'as87a0d5ad' :
			console.log('* Upload Model runned');

		default :
			findFolder();
			

	} // switch


};