module.exports = function(req, res) {


	require('./checkrouting')(req, res, function(rules){
		generateScreens(rules);
	});


	var generateScreens = function(rules){

		rules.forEach(function(ele){
			parseRule(ele);
		});

		res.send(rules);

	};


	var parseRule = function(rules){

		/*
		{
		"description": "All Pages route to subfolder Type",
		"rule": [
		[
		"type",
		"page"
		]
		],
		"path": {
		"origin": "/type/{{%cool-url}}.html",
		"tag": "cool-url"
		}
		},
		*/


 		console.log(rules.description);

 		// based on rules.rule stiahni tag/type 


	};

	

	
};