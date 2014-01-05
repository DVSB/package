module.exports = function() {
	
	var
	fingerprint = {};
		
	fingerprint.get = function(string) {
		
		var hash, crypto = require('crypto'), salt;
		
		salt = '80.98-vx=08.09-da=80.98-sd=87.65-as=67.87-df';
		
		hash = crypto.createHash('sha512').update(string).digest('hex');
		hash = hash + salt + string;
			
		hash = crypto.createHash('sha256').update(hash).digest('hex');	
		hash = parseInt(hash, 16).toString(36);

		return hash;

	};
	
	return fingerprint;

};
