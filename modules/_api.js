module.exports = function(req, res) {
	
	
	
	
	obj.fprint = {};
	
	
	obj.fprint.encrypt = function(hash) {
		
		hash = parseInt(hash, 36);
		console.log(hash);

		return hash;

	};
	
	obj.fprint.decrypt = function(fingerprint) {
		
		var hash, crypto = require('crypto'), salt;
		
		salt = '80.98-vx=08.09-da=80.98-sd=87.65-as=67.87-df';
		
		hash = crypto.createHash('sha512').update(string).digest('hex');
		hash = hash + salt + string;
			
		hash = crypto.createHash('sha256').update(hash).digest('hex');	
		hash = parseInt(hash, 16).toString(36);

		return hash;

	};
	
	

	
	
	obj.cookieSecret = function(string){

		var hash, crypto = require('crypto'), salt;
		
		salt = '74.27-as%87.47-as%82.47-vc%42.98-yx%14.89-xy';
		
		hash = crypto.createHash('sha512').update(string).digest('hex');
		hash = hash + salt + string;
			
		hash = crypto.createHash('sha256').update(hash).digest('hex');	
		hash = parseInt(hash, 16).toString(36);

		return hash;
	
	};

	return obj;	
	
};

