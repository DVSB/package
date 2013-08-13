module.exports = function(req, res) {


// variables


	var underscore = require('underscore');
	underscore.mixin(require('underscore.string').exports());
	
	var mongoclient = require('mongodb').MongoClient;
	var mongoDb = 'mongodb://nodejitsu:c73928b8cc2e315b339c263e5f6c95a1@dharma.mongohq.com:10066/nodejitsudb2231254279';


// functions


	var browseusers = function(){
		
		mongoclient.connect(mongoDb, function(err, db) {
	
			err ? res.send(err) : false;
			
			var collection = db.collection('users');
			collection.find().toArray(function(err, results) {
				err ? res.send(err) : false;
				res.send(results);
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

		default :
			res.render(__dirname+'/../views/admin.html');
			break;

	} // switch


};