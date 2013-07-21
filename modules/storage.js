exports.init = function(req, res) {

	// IMPORTS * yes, its global for now.. desperate times desperate measures

		// underscore and underscore string
		underscore = require('underscore');
		underscore.mixin(require('underscore.string').exports());
		
		// file system
		fs = require('fs');
		
		// settings
		settings = JSON.parse(fs.readFileSync('settings.json'));

		// amazon
		var AWS = require('aws-sdk');
		AWS.config.update({
			accessKeyId : settings.amazon.id,
			secretAccessKey : settings.amazon.key,
			region : settings.amazon.region
		});
		s3 = new AWS.S3();
		
	// ROUTING

		var model = require('./storage/_model');
		
		if (req.body.svc === 'as87a0d59d') {
			console.log('* Upload Model runned');
			//model.upload(req, res);
		} else if (req.body.button==='unlink') {
			console.log('* Unlink Model runned');
			//model.unlink(req, res);
		} else if (req.body.button==='rename') {
			console.log('* Rename Model runned');
			//model.rename(req, res);
		} else if (req.body.button==='move') {
			console.log('* Move Model runned');
			//model.move(req, res);
		} else if (req.body.button==='share') {
			console.log('* Share Model runned');
			//model.share(req, res);
		} else if (req.body.button==='download') {
			console.log('* Download Model runned');
			//model.download(req, res);
		} else if (req.body.button==='copy') {
			console.log('* Copy Model runned');
			//model.copy(req, res);
		} else {
			console.log('* Browse Model runned');
			model.browse(req, res);
		};

};