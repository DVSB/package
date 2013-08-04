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
				
		var verifyIdFromUrl = req.url;
		verifyIdFromUrl = underscore.words(verifyIdFromUrl, '/');
		//res.send(verifyIdFromUrl[2]);
		
		mongoclient.connect(mongoDb, function(err, db) {
			
			err ? res.send(err) : false;
			
			var user = {'name':'Samuel', 'surname':'Snopko'};
			var collection = db.collection('users');
			
			collection.insert(user, function(err, data) {

				console.log(data);
				
				collection.find().toArray(function(err, results) {
					res.send(results);
					db.close();
				});   
				
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