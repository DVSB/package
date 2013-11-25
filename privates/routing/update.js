module.exports = function(req, res) {
	
	
	// this is for all blogs and makes routing to /blog/:id
	// (type==='blog') && ( (author='ondrek') || (author==='kalabova') )
	// /blog-about-facebook/{{tag.coolurl}}/index.html
	

	var getAllRules = function(){

		var mdownapi = require('../../api/mdownapi')();
		var publicUserId = req.signedCookies.publickey;

		mdownapi.getJson(publicUserId, '/routing', function(data){
			parseRules(data);
		});

	};


	var parseRules = function(rules){

		var screenRules = req.body;
		var rulesArr = [];
		
		// convert form associative object to array
		var lengthOfObj = Object.keys(screenRules).length;
		for (var i=0; i<lengthOfObj; i++){
			rulesArr[i] = screenRules[i];
		}

		var last = rulesArr[rulesArr.length-1];
		
		console.log(last.desc&&last.rule&&last.path);
		
		console.log(isEmpty);

		return;

		s3.putObject({
 			Key : publicUserId+'/routing',
 			Body : JSON.stringify(screenRules),
			Bucket : 'api.mdown.co'
 		}, function(){
 			onEndCallback();
 		});

	};
	

	getAllRules();


};