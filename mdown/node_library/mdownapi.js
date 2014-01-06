module.exports = function() {
	
	var s3 = {};
	
	s3.getJson = function(userid, path, callback){

		path = 'http://api.mdown.co/'+userid+path;
		var body = '';

		var onSuccess = function(body){
			callback(body);
		}

		var onError = function(){
			callback(404);
		}

		require('http').get(path, function(res) {

			res.on('data', function(chunk) {
				body += chunk;
			});

			res.on('end', function() {
				try { body = JSON.parse(body);
				} catch(e) { callback(404); }
				onSuccess(body);
			});
			
		}).on('error', function(e) { throw e; }); 
		
	}
	
	return s3;
	
};
