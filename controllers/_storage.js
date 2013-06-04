exports.init = function(req, res) {

// IMPORTS

	// todo: yes, its global for now.. desperate times desperate measures
	underscore = require('underscore');
	underscore.mixin(require('underscore.string').exports());
	
	fs = require('fs');
	
	settings = JSON.parse(fs.readFileSync('settings.json'));

	var AWS = require('aws-sdk');
	AWS.config.update({
		accessKeyId : settings.amazon.id,
		secretAccessKey : settings.amazon.key,
		region : settings.amazon.region
	});
	s3 = new AWS.S3();
	
	crypto = require('crypto');
	
// ROUTING
	
	if (req.body.svc === 'as87a0d59d') { // If file is uploaded
		
		// test isArray is correct because in js array is also object
		if (underscore.isArray(req.files.myfile)) {
			require('./upload').Multiupload(req.files.myfile);
		} else {
			require('./upload').Upload(req.files.myfile);
		}

	} else {
					
		require('./storage/_model').browse(req, res);
		
	}
	
	if (req.body.button==='unlink') {
		
		require('./browse').UnlinkObject(req.body.item, function(){
			require('./browse').ListObjects(function(files) {
				res.render(__dirname + '/_view.html', {myfiles : files});
			});
		});
		
	}
	
	if (req.body.button==='rename') {
		console.log('rename');
	}
	if (req.body.button==='move') {
		console.log('move');
	}
	if (req.body.button==='share') {
		console.log('share');
	}
	if (req.body.button==='download') {
		console.log('download');
	}
	if (req.body.button==='copy') {
		console.log('copy');
	}

};
