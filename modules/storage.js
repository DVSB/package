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
		bucket : settings.bucket,
		storage : settings.storage,
		ServerSideEncryption : settings.encrypt
	});
	var s3 = new AWS.S3();

	
// functions


	var Unlink = function(items, callback) {

		var params = {
			Key : items
		};
		
		s3.client.deleteObject(params, function(err){
			if (err) { console.log(err); }
			callback();
		});

	}; // Unlink
	


	
	
	
	var browseFolder = function(prefix, callback){
						
		s3.client.listObjects({
			Bucket : settings.bucket,
			Delimiter : '/',
			Prefix : prefix ? prefix : settings.home+'/'
		}, function(err, data){
		
			if (err) { res.send(err); }
						
			// Make Array of Hashed and Unhashed Folders
			var hash, folders=[];
			data.CommonPrefixes.forEach(function(element, index) {
				folders[index] = {
					Key : element.Prefix,
					Hash : crypto.createHash('sha512').update(element.Prefix + settings.hash).digest('hex').substr(0, 10)
				}
			});
						
			// Make Array of Hashed and Unhashed Files
			var hash, files=[];
			data.Contents.forEach(function(element, index){
				files[index] = underscore.pick(data.Contents[index], 'Key', 'LastModified', 'Size');
				hash = crypto.createHash('sha512').update(element.Key + settings.hash).digest('hex').substr(0, 10);
				files[index] = underscore.extend(files[index], {'Hash' : hash});
			});
						
			res.render(__dirname+'/../views/storage', {myfiles: {
				folders : folders,
				files : underscore.rest(files)
			}});
		
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