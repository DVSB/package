

	var fs = require('fs');
	var settings = JSON.parse(fs.readFileSync('settings.json'));
	
	var AWS = require('aws-sdk');
	AWS.config.update({
		accessKeyId : settings.amazon.id,
		secretAccessKey : settings.amazon.key,
		region : settings.amazon.region
	});
	var s3 = new AWS.S3();
	
	var tab = {
		upload : require('./_tab-upload'),
		browse : require('./_tab-browse')
	};


	exports.Init = function(app, req, res) {

		if (req.body.svc === 'as87a0d59d') { // If file is uploaded
			
			tab.upload.Upload(s3, settings, fs, req, function(){
				tab.browse.ListObjects(s3, settings, function(files) {
					res.render(__dirname + '/_view.html', {myfiles : files});
				});
			});

		} else {
			
			tab.browse.ListObjects(s3, settings, function(files) {
				res.render(__dirname + '/_view.html', {myfiles : files});
			});			
			
		}
		
		console.log('tuna: ' + req.body.kokot);
		
		if (req.body.action === 'unlink'){
			console.log('unlink');
			console.log(req.body.kokot);
			tab.browse.UnlinkObject(s3, settings, req.body.item, function(){
				tab.browse.ListObjects(s3, settings, function(files) {
					res.render(__dirname + '/_view.html', {myfiles : files});
				});
			});
		}

		
	};

