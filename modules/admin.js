module.exports = function(req, res) {


// variables


	var underscore = require('underscore');
	underscore.mixin(require('underscore.string').exports());
	
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
	};


	var consoles = function(){
	
		mongoclient.connect(database, function(err, db) {
			
			if(err) throw err;
			var collection = db.collection('folders');
						
			collection.insert({
				name : 'Volleyball WWC in Seoul, Korea 3',
				time : '2011-03',
				hash : 'c89b2395'
			}, function(err, results) {
				db.close();
				browse();
			});
				
		}); // mongoclient

	}; // console


	var browseusers = function(){
		
		mongoclient.connect(database, function(err, db) {
	
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