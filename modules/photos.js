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
				console.log(results);
				db.close();
			});
		});
		
	}; // getAlbums


// routing and variables


	switch(req.body.action) {
		
		case 'createNewAlbum' :
			res.render(__dirname+'/../views/photos.html', {albums:results, view:'createNewAlbum'});
			break;
			
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

		default :
			getAlbums();
			break;

	} // switch


};