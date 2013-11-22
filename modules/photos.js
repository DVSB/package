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
	
	
	/* from photo mongo database and s3 */
	var removePhoto = function(){
		mongoclient.connect(database, function(err, db) {

			if (err) throw err;
			
			/* url../remove?98c582c7d329/3b1fa423d917 - album:98c582c7d329 photo:3b1fa423d917 */
			var url = require('url').parse(req.url).query;
			var album = underscore.words(url, '/')[0];
			var photo = underscore.words(url, '/')[1];
			
			findAlbumByUrlHashInDB();
			
			function findAlbumByUrlHashInDB(){
				var collection = db.collection('albums');
				collection.findOne({hash:album}, function(err, album) {
					if (err) throw err;
					findPhotoInAlbum(album);
				});
			}
			
			function findPhotoInAlbum(album) {
				var realNames = {};
				var photos = album.files;
				photos.forEach(function(element){
					if (element.hash===photo) {
						realNames.photo = element.name;
						realNames.album = album.name;
						removePhotoFromS3(realNames, removePhotoFromDB);
					}
				});
			}
			
			function removePhotoFromS3(realNames, callback){
				s3.client.deleteObject({
					Bucket : settings.bucket,
					Key : settings.home + '/Photos/' + realNames.album + '/' + realNames.photo
				}, function(err){
					if(err) throw err;
					callback(realNames.photo);
				});
			}
			
			function removePhotoFromDB(photoName){
				/* remove item in array files where name=title parameter */
				var collection = db.collection('albums');
				collection.update({hash:album}, {$pull:{files:{name:photoName}}}, function(err) {
					if (err) throw err;
					res.redirect('/photos/album?'+album);
					db.close();
				});
			}
			
		});	
	}; // removePhoto

	
	/* from photo mongo database and s3 */
	var downloadPhoto = function(){
		mongoclient.connect(database, function(err, db) {
		
			if (err) throw err;
			
			/* url../download?98c582c7d329/3b1fa423d917 - album:98c582c7d329 photo:3b1fa423d917 */
			var url = require('url').parse(req.url).query;
			var album = underscore.words(url, '/')[0];
			var photo = underscore.words(url, '/')[1];
			
			findAlbumByUrlHashInDB();
			
			function findAlbumByUrlHashInDB(){
				var collection = db.collection('albums');
				collection.findOne({hash:album}, function(err, album) {
					if (err) throw err;
					findPhotoInAlbum(album);
				});
			}
			
			function findPhotoInAlbum(album) {
				var realNames = {};
				var photos = album.files;
				photos.forEach(function(element){
					if (element.hash===photo) {
						realNames.photo = element.name;
						realNames.album = album.name;
						downloadPhotoFromS3(realNames);
					}
				});
			}
			
			function downloadPhotoFromS3(realNames, callback){
				s3.client.getObject({
					Bucket : settings.bucket,
					Key : settings.home + '/Photos/' + realNames.album + '/' + realNames.photo
				}, function(err, data){
					if(err) throw err;
					var buf = new Buffer(data.Body, 'binary');
					res.set('Content-Type', 'binary/octet-stream');
					res.send(200, buf);
					res.redirect('/photos/album?'+album);
					db.close();
				});
			}
			
		
		});
	}; // downloadPhoto
	

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
			
		case 'download' :
			downloadPhoto();
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