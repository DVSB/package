module.exports = function(req, res) {


	var getAllRules = function(){

		var mdownapi = require('../../api/mdownapi')();
		var userId = req.signedCookies.publickey;

		mdownapi.getJson(userId, '/routing', function(data){
			var request = req.body;
			if (request.remove) removeRules(data);
			if (request.update) updateRules(data);
		});

	};


	var removeRules = function(rules){

		var checked = req.body.checked;
		var request = req.body;

		for (var i=checked.length; i--; ) {
			rules.splice(checked[i], 1);
		}

		uploadNewConfig(rules);

	};


	var updateRules = function(rules){

		var request = req.body;
		
		var checked = request.checked;
		checked = (checked.length===1) ? [checked] : checked;

		checked.forEach(function(ele){
			rules[ele] = request[ele];
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