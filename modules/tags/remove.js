module.exports = function(req, res) {


	var getAllTags = function(){

		var mdownapi = require('../../api/mdownapi')();
		var userId = req.signedCookies.publickey;

		mdownapi.getJson(userId, '/all/tags', function(data){
			removeSpecificTag(data);
		});

	};


	var removeSpecificTag = function(tags){

		var whatToRemove = req.body.tag;
		var indexInArr = tags.indexOf(whatToRemove);
		var arrContains = (indexInArr> -1);

		if (arrContains) {
		    tags.splice(indexInArr, 1);
		    uploadNewConfig(tags);
		} else { res.send('sorry, this tag doesnt not exists'); }

	};


	var uploadNewConfig = function(updatedTags){

		var s3 = require('../../api/s3')();
		var userId = req.signedCookies.publickey;
		
 		s3.putObject({
 			Key : userId+'/all/tags',
 			Body : JSON.stringify(updatedTags),
			Bucket : 'api.mdown.co'
 		}, function(){
 			res.redirect('/tags/');
 		});

	};


	getAllTags();
	
};
