module.exports = function() {
	
	var s3 = {};
	
	s3.getJson = function(userid, path, callback){

		path = 'http://api.mdown.co/'+userid+path;
		var body = '';

		require('http').get(path, function(res) {

			res.on('data', function(chunk) {
				body += chunk;
			});

			res.on('end', function() {
				callback(JSON.parse(body));
			});
			
		}).on('error', function(e) { throw e; }); 
		
	}
	
	return s3;
	
};
