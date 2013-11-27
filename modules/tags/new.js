module.exports = function(req, res) {


	var getAllTags = function(){

		var mdownapi = require('../../api/mdownapi')();
		var userId = req.signedCookies.publickey;

		mdownapi.getJson(userId, '/tags', function(data){
			addNewOne(data);
		});

	};


	var addNewOne = function(tags){

		tags.push(req.body.tag);
		uploadNewConfig(tags);

	};


	var uploadNewConfig = function(updatedTags){

		var s3 = require('../../api/s3')();
		var userId = req.signedCookies.publickey;
		
 		s3.putObject({
 			Key : userId+'/tags',
 			Body : JSON.stringify(updatedTags),
			Bucket : 'api.mdown.co'
 		}, function(){
 			res.redirect('/tags/');
 		});

	};


	getAllTags();
	
};