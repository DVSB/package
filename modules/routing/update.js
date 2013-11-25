module.exports = function(req, res) {


	var getAllRules = function(){

		var mdownapi = require('../../api/mdownapi')();
		var userId = req.signedCookies.publickey;

		mdownapi.getJson(userId, '/routing', function(data){
			removeChecked(data);
		});

	};


	var remove = function(rules){

		var checked = req.body.checked;

		checked.forEach(function(ele){
			array.splice(ele, 1);
		});

		uploadNewConfig(rules);

	};


	var uploadNewConfig = function(updatedRules){

		var s3 = require('../../api/s3')();
		var userId = req.signedCookies.publickey;
		
 		s3.putObject({
 			Key : userId+'/routing',
 			Body : JSON.stringify(updatedRules),
			Bucket : 'api.mdown.co'
 		}, function(){
 			res.redirect('/routing/');
 		});

	};


	getAllRules();

};