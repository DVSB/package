module.exports = function(req, res) {


// variables


	var crypto = require('crypto');
	var fs = require('fs');
	var AWS = require('aws-sdk');
	var settings = JSON.parse(require('fs').readFileSync('_settings.json')).settings;
	
	var underscore = require('underscore');
	underscore.mixin(require('underscore.string').exports());
	
	var mongoclient = require('mongodb').MongoClient;
	var mongoDb = 'mongodb://nodejitsu:c73928b8cc2e315b339c263e5f6c95a1@dharma.mongohq.com:10066/nodejitsudb2231254279';
	
// functions
	
	
	var verifyEmail = function(){
		
		var onSuccess = function(result){
			result.verified = true;
			collection.update({ key : keyFromUrl }, result, function(err, data){
				err ? res.send(err) : false;
				db.close();
				res.redirect('/');
			});
		};
				
		mongoclient.connect(mongoDb, function(err, db) {
		
			err ? res.redirect('/error/e001') : false;
			
			var keyFromUrl = underscore.words(req.url, '/')[2];
			
			var collection = db.collection('users');
			collection.findOne({
				key : keyFromUrl
			}, function(err, result) {
				
				console.log(result);
				
				if (err) {
					res.redirect('/error/e', {
						name: '???', 
						message: '???'
					});
				} else if (!result){
					res.redirect('/error/e?e0001');
					
				} else {
					onSuccess(result);
				}
				
			}); 
			
		}); // mongoclient
	
	}; // verifyEmail


// routing and variables

	var urlMethod = underscore.trim(req.url, '/');
	urlMethod = underscore.words(urlMethod, '/');
	urlMethod = underscore.rest(urlMethod);
	urlMethod = underscore.first(urlMethod);
	
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