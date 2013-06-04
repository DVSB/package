
	exports.browse = function(req, res) {

		var browsetab = require('./browse');
		
		browsetab.ListAll(function(filesAndFolders){
			var renderedView = __dirname + '/../../views/_view.html';
			res.render(renderedView, {myfiles : filesAndFolders});
		});
		
	};

	exports.upload = function(req, res) {

		// test isArray is correct because in js array is also object
		if (underscore.isArray(req.files.myfile)) {
			require('./upload').Multiupload(req.files.myfile);
		} else {
			require('./upload').Upload(req.files.myfile);
		}

	};


	exports.unlink = function(req, res) {

		require('./browse').UnlinkObject(req.body.item, function(){
			require('./browse').ListObjects(function(files) {
				res.render(__dirname + '/_view.html', {myfiles : files});
			});
		});
			
	};