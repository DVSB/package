module.exports = function(req, res) {
	
	
	var createNew, getRandom, updateLifeCycle, getLifeCycle, bucket = 'mdown',
	markdown=require('markdown').markdown,
	s3 = require('./_api')().s3, luhn = require('./_api')().luhn, 
	random = require('./_api')().random;


	createNew = function() {
				
		var getRandom, key, redirectToPage,
		cookies = req.signedCookies;

		key = random.generate();

		s3.putObject({
			key : cookies.userid+'/articles/'+key,
			body : req.body.markdown ? req.body.markdown : 'empty',
		}, function(){
			res.redirect('/-/view/'+key);
		});
		
	};
	
	module = require('url').parse(req.url);
	module = module.pathname.split('/')[3];
			
	// routing of URL 
	switch(module) {
		
		case 'create': 
		createNew();
		break;
		
		default:
		res.render('create.html');
		break;
		
	};
	
	
};
