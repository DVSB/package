module.exports = function(req, res) {


	var getAllTags = function(){

		var mdownapi = require('../../api/mdownapi')();
		var userId = req.signedCookies.publickey;

		mdownapi.getJson(userId, '/all/tags', function(data){
			renameSpecificTag(data);
		});

	};


	var renameSpecificTag = function(tags){

		var oldTag = req.body.oldtag;
		var newTag = req.body.newtag;

		// replace old value in array
		tags[tags.indexOf(oldTag)] = newTag;

		uploadNewConfig(tags);

	};


	var uploadNewConfig = function(updatedTags){

		var s3 = require('../../api/s3')();
		var userId = req.signedCookies.publickey;
		
 		s3.putObject({
 			Key : userId+'/all/tags',
 			Body : JSON.stringify(updatedTags),
			Bucket : 'api.mdown.co'
 		}, function(){
 			res.redirect('/-/tags/');
 		});

	};


	getAllTags();
	
};