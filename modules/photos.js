module.exports = function(req, res) {


// variables


	// libs

	var crypto = require('crypto');
	var fs = require('fs');
	var AWS = require('aws-sdk');
	var settings = JSON.parse(require('fs').readFileSync('_settings.json')).settings;
	
	var underscore = require('underscore');
	underscore.mixin(require('underscore.string').exports());
	
	// amazon
	
	AWS.config.update({ 
		accessKeyId : settings.awsId,
		secretAccessKey : settings.awsKey,
		region : settings.region,
		bucket : settings.bucket,
		storage : settings.storage
	});
	var s3 = new AWS.S3();
	
	// mongodb
	
	var mongoclient = require('mongodb').MongoClient;
	var ObjectId = require('mongodb').ObjectID;
	var database = 'mongodb://127.0.0.1:27017';
	
	
// functions


	var redirectIfUrlRoot = function(){
	
		var url = underscore.trim(req.url, '/');
		url = underscore.words(url, '/');
		
		if (url[0]==='photos' && url.length===1){
			res.redirect('/photos/browse');
		}
	
	}(); // redirectIfUrlRoot
	

	var browse = function(){
		
		mongoclient.connect(database, function(err, db) {
			if(err) throw err;
			var collection = db.collection('folders');
			collection.find().toArray(function(err, results) {
				console.dir(results);
				db.close();
			});   
		});	
		
	}; // browse


	var getAlbums = function(){
								
		mongoclient.connect(database, function(err, db){
			if(err) throw err;
			var collection = db.collection('folders');
			collection.find().toArray(function(err, results) {
				res.render(__dirname+'/../views/photos', {albums:results, view:'browse'});
				db.close();
			});
		});
		
	}; // getAlbums
	
	
	var upload = function(){
		
		var album = req.body.albumName;
		var files = req.files.images;
		
		if (files.size===0){
			res.send('You didnt upload any photo');
		}
		
		// if one file, make array with one object
		if (!(files instanceof Array)){
			var onefile = files;
			var files = [];
			files[0] = onefile;
		}
		
		var addToDatabase = function(files){
			
			console.log('i am in addToDatabase!');
			
			mongoclient.connect(database, function(err, db){
				var grid = new Grid(db, 'fs');
				var originalData = new Buffer('Hello world');
				var id = 123;
				grid.put(originalData, {_id: id}, function(err, result) {
					console.log(result);
					console.log(err);
					db.close();
				});
			}); // mongoclient
		
		}; // addToDatabase
		
		var uploadFile = function(i){
			
			var file = files[i];

			s3.client.putObject({
				Bucket : settings.bucket,
				Key : settings.home + '/Photos/' + album + '/' + file.name,
				Body : fs.readFileSync(file.path)
			}, function(err, data){
				
				if (err) throw err;
				fs.unlinkSync(file.path);
				
				if (i==files.length-1) {
					res.redirect('/photos/browse');
				} else {
					uploadFile(++i);
				}
				
			});
				
		}; // uploadFile
		
		uploadFile(0);
		
		
		
		
	}; // upload


// routing and variables


	var urlMethod = underscore.trim(req.url, '/');
	urlMethod = underscore.words(urlMethod, '/');
	urlMethod = underscore.rest(urlMethod);
	urlMethod = underscore.first(urlMethod);
	
	
	switch(urlMethod) {
			
		case 'new' :
			res.render(__dirname+'/../views/photos', {view:'new'});
			break;
			
		case 'upload' :
			upload();
			break;
			
		case 'browse' :
			getAlbums();
			break;

	} // switch

	switch(req.body.action) {
			
		case 'edit' :
			res.send('edit');
			break;
		
		case 'download' :
			findFolderBasedOnPrefix();
			break;
			
		case 'cut' :
			res.send('cut');
			break;
		
		case 'copy' :
			res.send('copy');
			break;
			
		case 'paste' :
			res.send('paste');
			break;
			
		case 'delete' :
			res.send('delete');
			break;
			
		case 'share' :
			res.send('share');
			break;

	} // switch


};




/*

	ex-upload.js
	============




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




	// routing and variables


		switch(req.body.action) {
		
			case 'as87a0d59d' :
				console.log('* Upload Model runned');
				break;
			
			case 'as87a0d5ad' :
				console.log('* Upload Model runned');
				break;

			default :
				//DefaultUpload();
				res.render(__dirname+'/../views/upload.html');
				break;

		} // switch


	};

*/