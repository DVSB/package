module.exports = function(req, res) {
	
	
	var createNew, getRandom, updateLifeCycle, getLifeCycle, bucket = 'mdown',
	markdown=require('markdown').markdown,
	s3 = require('./_api')().s3, luhn = require('./_api')().luhn, 
	random = require('./_api')().random;


	createNew = function() {
		
		var getRandom, key, redirectToPage;
		
		// looks like `hn06xqi4` and represent date of creating
		// which is written as 36base string
		key = random.generate();
		
		redirectToPage = function(){
			res.redirect('/-'+key);
		}
			
		// normal title of markdown file is based on uniq name, which
		// browsable on url and with details like date when should be
		// file expired, like `hn06xqi4`
		s3.putObject({
			key : key,
			body : req.body.markdown ? req.body.markdown : 'empty',
		}, function(){
			redirectToPage()
		});
		
	};	
	
	
	unlink = function(){
		
		/*
		var date, random;
		
		module = require('url').parse(req.url);
		module = module.pathname.split('/')[2];
		
		s3.client.deleteObject({
			Bucket : bucket,
			Key : module
		}, function(err, data){
			if (err) throw err;
			res.redirect('/');
		});
		*/l
		
	};		


	// get from URL module
	module = require('url').parse(req.url);
	module = module.pathname.split('/')[2];
			
	// routing of URL 
	switch(module) {
		
		case 'create': 
		createNew();
		break;
		
		case 'unlink': 
		unlink();
		break;
		
		default:
		res.redirect('/');
		break;
		
	};
	
	
};
