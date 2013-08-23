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
				res.render(__dirname+'/../views/photos.html', {albums:results, view:'albums'});
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
		
		for (var i=0; i<=files.length-1; i++) {
		
			var file = files[i];
			
			s3.client.putObject({
				Bucket : settings.bucket,
				Key : settings.home + '/Photos/' + album + '/' + file.name,
				Body : fs.readFileSync(file.path)
			}, function(err, data){
				if (err) throw err;
				fs.unlinkSync(file.path);
				if (i===files.length) {
					res.redirect('/photos/browse');
				}
			});
		
		}
		
	}; // upload


// routing and variables


	var urlMethod = underscore.trim(req.url, '/');
	urlMethod = underscore.words(urlMethod, '/');
	urlMethod = underscore.rest(urlMethod);
	urlMethod = underscore.first(urlMethod);
	
	
	switch(urlMethod) {
			
		case 'new' :
			res.render(__dirname+'/../views/photos.html', {view:'createNewAlbum'});
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