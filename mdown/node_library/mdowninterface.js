module.exports = function() {
	
	var s3 = {};
	
	s3.getUser = function(userid, callback){
		
		path = 'http://interface.mdown.co/'+userid+'/user.json';
		var body = '';

		require('http').get(path, function(res) {

			res.on('data', function(chunk) {
				body += chunk;
			});

			res.on('end', function() {
				try { callback(JSON.parse(body));
				} catch(e) { callback(404); }
			});
			
		}).on('error', function(e) { throw e; }); 
		
	}
	
	return s3;
	
};
