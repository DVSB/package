
	var tab = {
		upload : require('./_tab-upload'),
		browse : require('./_tab-browse')
	};
	

	exports.Init = function(app, req, res) {

		if (req.body.svc === 'as87a0d59d') { // If file is uploaded
			
			tab.upload.Upload(req, function(fileProperties){
				res.render(__dirname + '/_view.html', {hello : fileProperties});
			});
			
		} else if (req.body.svc === 'bb87a0da8a') {
			
			tab.browse.Unlink(req.body.item);
			
		}

		tab.browse.ListObjects(function(files){
			res.render(__dirname + '/_view.html', {myfiles : files});
		});

		
	};












