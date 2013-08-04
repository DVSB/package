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
		storage : settings.storage
	});
	var s3 = new AWS.S3();
	
	var mongoclient = require('mongodb').MongoClient;
	var mongoDb = 'mongodb://nodejitsu:c73928b8cc2e315b339c263e5f6c95a1@dharma.mongohq.com:10066/nodejitsudb2231254279';

	
// functions
	
	var verifyEmail = function(){
		
		mongoclient.connect(mongoDb, function(err, db) {
		
			err ? res.send(err) : false;
		
			var keyFromUrl = req.url;
			keyFromUrl = underscore.words(keyFromUrl, '/');
			keyFromUrl = keyFromUrl[2];
			
			var collection = db.collection('users');
			
			var markVerified = function(){
				collection.update({ key : keyFromUrl }, { verify : true }, function(err, data){
					err ? res.send(err) : res.send(data);
					db.close();
				}); 
			};

			collection.find({
				key : keyFromUrl
			}).toArray(function(err, results) {
				err ? res.send(err) : false;
				markVerified();
			}); 
			
		}); // mongoclient
	
	}; // verifyEmail
		


// routing and variables

	var urlMethod = underscore.trim(req.url, '/');
	urlMethod = underscore.words(urlMethod, '/');
	urlMethod = underscore.rest(urlMethod);
	urlMethod = underscore.first(urlMethod);
	
	console.log(urlMethod);

	switch(urlMethod) {
	
		case 'verify' :
			verifyEmail();
			break;
		
		case 'as87a0d5ad' :
			console.log('*');
			break;

		default :
			console.log('*');
			break;

	} // switch
	

}