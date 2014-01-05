module.exports = function(req, res, callback) {


	var mdownapi = require('../../api/mdownapi')();
	var userId = req.signedCookies.publickey;
	var underscore = require('underscore');
	underscore.mixin(require('underscore.string').exports());


	var parseRules = function(object){

		// separate rules string to array of rules
		// from: ==> type='blog', thunb = 'yes', public = ' yes '
		// into: ==> ["type='blog'","thunb = 'yes'","public = ' yes '"]
		object.forEach(function(ele){
			ele.rule = underscore.words(ele.rule, ',');
		});

		// remove all white spaces and aphostrphs from each tag
		// from: ==> ["type='blog'","thunb = 'yes'","public = ' yes '"]
		// into: ==> ['type=blog', 'thunb=yes', 'public=yes']
		object.forEach(function(ele, i){
			ele.rule.forEach(function(string, j){
				string = string.replace(/\s+/g, '');
				string = string.replace(/'/g, '');
				object[i]['rule'][j] = string;
			});
		});

		// remove all white spaces from each tag
		// from: ==> ['type=blog', 'thunb=yes', 'public=yes']
		// into: ==> [[type, blog], [thunb, yes], [public, yes]]
		object.forEach(function(ele, i){
			ele.rule.forEach(function(string, j){
				string = underscore.words(string, '=');
				object[i]['rule'][j] = [ 
					string['0'], string['1'] 
				];
			});
		});

		return object;

	};


	var parsePath = function(object){

		// remove all white spaces
		// from: ==> "/blog/ {{% cool-url }} .html "
		// into: ==> "/blog/{{%cool-url}}.html"
		object.forEach(function(ele){
			console.log(ele.path);
			ele.path = ele.path.replace(/\s+/g, '');
			console.log(ele.path);
		});

		// search for tags
		object.forEach(function(ele){
			ele.path = { origin : ele.path };
			ele.path.tag = underscore(ele.path.origin).strRight('{{%');
			ele.path.tag = underscore(ele.path.tag).strLeft('}}');
		});

		return object;

	};


	mdownapi.getJson(userId, '/routing', function(rules){
		rules = parseRules(rules);
		rules = parsePath(rules);
		callback(rules);
	});


};