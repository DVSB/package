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


	var DefaultUpload = function(req, res) {

		// test isArray is correct because in js array is also object
		if (underscore.isArray(req.files.myfile)) {
			require('./ObjectMultiupload').Multiupload(req.files.myfile);
		} else {
			require('./ObjectUpload').Upload(req.files.myfile);
		}

	}; // DefaultUpload


	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

	
	
	var browseFolder = function(prefix){
						
		s3.client.listObjects({
			Bucket : settings.bucket,
			Delimiter : '/',
			Prefix : prefix ? prefix : settings.home+'/'
		}, function(err, data){
		
			if (err) { res.send(err); }
						
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
	
	}; // browseFolder
	
		
	var findFolderBasedOnPrefix= function(){
		
		var prefix = '';
		
		var foldersFromUrl = underscore.trim(req.url, '/');
		foldersFromUrl = underscore.words(foldersFromUrl, '/');
		foldersFromUrl = underscore.rest(foldersFromUrl);
				
		var getCurrentFolder = function(iterator, prefix){
			
			// is last
			if (foldersFromUrl.length===iterator){
				browseFolder(prefix);
				return;
			}
			
				
			s3.client.listObjects({
				Bucket : settings.bucket,
				Delimiter : '/',
				Prefix : prefix ? prefix : settings.home+'/'
			}, function(err, data){
		
				if (err) { res.send(err); }
				
				var hashedFolder;
				data.CommonPrefixes.forEach(function(element){
					hashedFolder = crypto.createHash('sha512').update(element.Prefix + settings.hash).digest('hex').substr(0, 10);
					// (hashed folder from s3)==(iterated folder from URL)
					hashedFolder===foldersFromUrl[iterator] ? getCurrentFolder(++iterator, element.Prefix) : false;
				});
		
			});
	
		}; // getCurrentFolder
		
		// if browsing root - /storage/ - browse empty prefix only
		var isRoot = foldersFromUrl.length===0;
		isRoot ? browseFolder('', 0) : getCurrentFolder(0);
		
	}; // findFolderBasedOnPrefix


// routing and variables


	switch(req.body.action) {
		
		case 'as87a0d59d' :
			console.log('* Upload Model runned');
			break;
			
		case 'as87a0d5ad' :
			console.log('* Upload Model runned');
			break;

		default :
			findFolderBasedOnPrefix();
			break;

	} // switch


};