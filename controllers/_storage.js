
	exports.init = function(req, res) {
	
		// todo: yes, its global for now.. desperate times desperate measures
		underscore = require('underscore');
		underscore.mixin(require('underscore.string').exports());
				
		if (req.body.svc === 'as87a0d59d') { // If file is uploaded
			
			// in javascript is array object, so this construction of conditional :)
			if (underscore.isArray(req.files.myfile)) {
				// multiupload
				//require('./upload').Multiupload(s3, settings, req.files.myfile);
			} else {
				// upload
				//require('./upload').Upload(s3, settings, req.files.myfile);
			}

		} else {
						
			require('./storage/_model').browse(req, res);
			
		}
		
		if (req.body.button==='unlink') {
			
			//require('./browse').UnlinkObject(s3, settings, req.body.item, function(){
			//	require('./browse').ListObjects(s3, settings, function(files) {
			//		res.render(__dirname + '/_view.html', {myfiles : files});
			//	});
			//});
			
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

