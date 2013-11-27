module.exports = function(req, res, callback) {


	var mdownapi = require('../../api/mdownapi')();
	var userId = req.signedCookies.publickey;


	var parseRules = function(rules){

		var underscore = require('underscore');
		underscore.mixin(require('underscore.string').exports());

		// separate rules string to array of rules
		rules.forEach(function(ele){
			ele.rule = underscore.words(ele.rule, ',')
		});

		// remove empty spaces from each tag
		rules.forEach(function(ele, i){
			ele.rule.forEach(function(string, j){
				console.log(string);
				rules[i]['rule'][j] = underscore.trim(string);
				console.log(string);
			});
		});

		

		callback(rules);

	}


	mdownapi.getJson(userId, '/routing', function(rules){
		parseRules(rules);
	});


};