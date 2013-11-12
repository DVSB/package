module.exports = function(req, res) {

	var getAllTags = function(){

		var mdownapi = require('../../api/mdownapi')();
		var userId = req.signedCookies.publickey;

		mdownapi.getJson(userId, '/all/tags', function(data){
			addNewOne(data);
		});

	};


	var addNewOne = function(tags){

		tags.push(req.body.tag);
		uploadNewConfig(tags);

	};


	var addNewOne = function(updatedTags){

		var s3 = require('../../api/s3')();
		var publicUserId = req.signedCookies.publickey;
		
 		s3.putObject({
 			Key : publicUserId+'/tags/'+req.body.type,
 			Body : JSON.stringify(toUpload),
			Bucket : 'api.mdown.co'
 		}, function(){
 			res.redirect('./?'+req.body.type);
 		});

	};


	getAllTags();
	
};

