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
	//var database = 'mongodb://n200:pepeknamornik@paulo.mongohq.com:10071/users-albums';
	
	
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
			var collection = db.collection('albums');
			collection.find().toArray(function(err, results) {
				console.dir(results);
				db.close();
			});   
		});	
		
	}; // browse


	var getAlbums = function(){
								
		mongoclient.connect(database, function(err, db){
			if(err) throw err;
			var collection = db.collection('albums');
			collection.find().toArray(function(err, results) {
				res.render(__dirname+'/../views/photos', {albums:results, view:'browse'});
				db.close();
			});
		});
		
	}; // getAlbums
	
	
	// get album photos and display
	var browseAlbum = function(){
		
		var urlAlbum = underscore.trim(req.url, '/');
		urlAlbum = underscore.words(urlAlbum, '/');
		urlAlbum = underscore.rest(urlAlbum);
		urlAlbum = underscore.first(urlAlbum);
		urlAlbum = underscore.words(urlAlbum, '?');
		urlAlbum = underscore.rest(urlAlbum);
		urlAlbum = underscore.first(urlAlbum);	
		
		mongoclient.connect(database, function(err, db){
			if(err) throw err;
			var collection = db.collection('albums');
			collection.findOne({hash:urlAlbum}, function(err, results) {
				if(err) throw err;
				res.render(__dirname+'/../views/photos', {albums:results, view:'album'});
				//res.send(results);
				db.close();
			});
		}); // mongoclient
		
	}; // browseAlbum
	
	
	var upload = function(){
		
		var albumName = req.body.albumName;
		var albumDate = req.body.albumDate;
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
		
		// create list of photos for saving to collection
		var photos = [];
		files.forEach(function(element, index){
			photos[index] = underscore.pick(element, 'name', 'lastModifiedDate', 'type', 'size');
			photos[index].hash = crypto.createHash('sha512').update(photos[index].name + settings.hash).digest('hex').substr(0, 12);
		});
		
		
		// add to mongo database of album details and photo details
		var addToDatabase = function(){
			
			mongoclient.connect(database, function(err, db){
				
				if(err) throw err;
				var collection = db.collection('albums');
				
				collection.insert({
					name : albumName,
					time : albumDate,
					hash : crypto.createHash('sha512').update(albumName + settings.hash).digest('hex').substr(0, 12),
					files : photos
				}, function(err, results) {
					db.close();
					res.redirect('/photos/browse');
				}); // insert
			
			}); // mongoclient
		
		}; // addToDatabase
		
		
		// upload file to S3
		var uploadFile = function(i){
			
			var file = files[i];

			s3.client.putObject({
				Bucket : settings.bucket,
				Key : settings.home + '/Photos/' + albumName + '/' + file.name,
				Body : fs.readFileSync(file.path)
			}, function(err, data){
				
				if (err) throw err;
				fs.unlinkSync(file.path);
				
				if (i==files.length-1) {
					addToDatabase();
				} else {
					uploadFile(++i);
				}
				
			});
				
		}; // uploadFile
		
		uploadFile(0);
		
	}; // upload
	
	
	var removePhoto = function(){
		mongoclient.connect(database, function(err, db) {
			
			if (err) throw err;
			var collection = db.collection('albums');
			
			var url, album, photo;
				
			url = require('url').parse(req.url);
			url = underscore.words(url.query, '/');
	
			album = url[0];
			photo = url[1];
			
			function manipulateAlbum(album){
				var photos = album.files;
				photos.forEach(function(element, index){
					if (element.hash===query.photo) res.send(element.name);
				});
			}
								
			collection.findOne({hash:album}, function(err, result) {
				if (err) throw err;
				console.log(result);
				//manipulateAlbum(result);
			});
			
			
			
			
			
/*
var remoteThisOne = function(album, photo){

	mongoclient.connect(database, function(err, db) {

		if (err) throw err;

		// remove from s3 and from database
		s3.client.deleteObject({
			Bucket : settings.bucket,
			Key : settings.home + '/Photos/' + album + '/' + photo
		}, function(err, data){
			if(err) throw err;
			var collection = db.collection('albums');
			album.file
			collection.update({name:album}, {name:album}, function(err, done) {
				if (err) throw err;
				res.send('hotovo');
				db.close();
			});
		});

	});

} // removeThisOne

});
*/
			
			db.close();
		});	
	}; // removePhoto


// routing and variables

	var urlModule; 
	
	// cut module
	urlModule = underscore.trim(req.url, '/');
	urlModule = underscore.words(urlModule, '/');
	urlModule = underscore.rest(urlModule);
	urlModule = underscore.first(urlModule);
	urlModule = underscore.words(urlModule, '?');
	urlModule = underscore.first(urlModule);
	
	switch(urlModule) {
			
		case 'new' :
			res.render(__dirname+'/../views/photos', {view:'new'});
			break;
			
		case 'upload' :
			upload();
			break;
			
		case 'browse' :
			getAlbums();
			break;
			
		case 'album' :
			browseAlbum();
			break;
			
		case 'removep' :
			removePhoto();
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