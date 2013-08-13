module.exports = function(req, res) {


// variables


	var underscore = require('underscore');
	underscore.mixin(require('underscore.string').exports());
	
	var mongoclient = require('mongodb').MongoClient;
	var ObjectId = require('mongodb').ObjectID;
	var mongoDb = 'mongodb://nodejitsu:c73928b8cc2e315b339c263e5f6c95a1@dharma.mongohq.com:10066/nodejitsudb2231254279';
	var crypto = require('crypto');

// functions


	var consoles = function(){
	
		mongoclient.connect(mongoDb, function(err, db) {

			err ? res.send(err) : false;
		
			var collection = db.collection('users');
			
			collection.find().toArray(function(err, results) {
				err ? res.send(err) : false;
				
			}); 
				
		}); // mongoclient

	}; // console


	var browseusers = function(){
		
		mongoclient.connect(mongoDb, function(err, db) {
	
			err ? res.send(err) : false;
			
			var collection = db.collection('users');
			collection.find().toArray(function(err, results) {
				err ? res.send(err) : false;
				res.render(__dirname+'/../views/admin.html', { users: results });
				db.close();
			}); 
			
		}); // mongoclient
	
	}; // browseusers

	


// routing and variables


	var urlMethod = underscore.trim(req.url, '/');
	urlMethod = underscore.words(urlMethod, '/');
	urlMethod = underscore.rest(urlMethod);
	urlMethod = underscore.first(urlMethod);

	switch(urlMethod) {

		case 'browseusers' :
			browseusers();
			break;
			
		case 'consoles' :
			consoles();
			break;

		default :
			res.send('<a href="/admin/browseusers">browser users</a>');
			break;

	} // switch


};