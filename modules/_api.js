module.exports = function(req, res) {
	
	var s3, sdk = require('aws-sdk'), obj = {}, 
	settings;
	
	settings = require('fs').readFileSync('./settings.json');
	settings = JSON.parse(settings);
	
	s3 = new sdk.S3({ 
		accessKeyId : settings.amazon.accessKeyId, 
		secretAccessKey : settings.amazon.secretAccessKey,
		s3: settings.amazon.apiVersion
	});
	
	obj.s3 = {
	
		// putobject to s3 is internal api and should have in future
		// also more functions after callback, like metatags or like
		// storageclass or enryption settings..
		putObject : function(params, callback){
		
			s3.client.putObject({
				Body : params.Body,
				Key : params.Key,
				Bucket : 'mdown',
				StorageClass : 'REDUCED_REDUNDANCY',
				ServerSideEncryption : 'AES256'
			}, function(err, data){
				if (err) throw err;
				callback(data);
			});
		
		},
		
		// list all objects in s3, if prefix is empty list all files
		// in bucket, we can define prefix, delimiter and markers and
		// all are optional
		listObjects : function(params, callback){
			
			s3.client.listObjects({
				Bucket : 'mdown',
				Prefix : params.Prefix
			}, function(err, data){
				if (err) throw err;
				callback(data);
			});
		
		},
		
		// get object from s3, only key is required, always should
		// be defined with callback
		getObject : function(params, callback){
			
			s3.client.getObject({
				Bucket : 'mdown',
				StorageClass : 'REDUCED_REDUNDANCY',
				ServerSideEncryption : 'AES256',
				Key : params.Key
			}, function(err, data){
				if (err) throw err;
				callback(data);
			});
		
		},
		
		// remove object from datastore, can be used for remove whole
		// user but also for removing only article or module, be affraid
		// with this module
		deleteObjects : function(params, callback){
			
			s3.client.deleteObjects({
				Bucket : 'mdown',
				Delete : params.Delete
			}, function(err, data){
				if (err) throw err;
				callback(data);
			});
		
		},
		
		
		isObjectExists : function(params, callback){
			
			s3.client.getObject({
				Bucket : 'mdown',
				Key : params.Key
			}, function(err, data){
				if (err && err.name==='NoSuchKey') { callback(false); }
				if (data){ callback(true); }
			});
		
		},
		
		copyObject : function(params, callback){
			
			s3.client.copyObject({
				Bucket : 'mdown',
				CopySource : params.CopySource,
				Key : params.Key
			}, function(err, data){
				if (err) throw err;
				callback(data);
			});
			
		}
	
	
	};
	
	
	obj.luhn = {
	
		// calculate luhn return one number which works like control
		// sum for testing number, this number should be added to end
		// calculate(100) => 4 --- and --- validate(1004) => true
		calculate : function(originalStr){

			var sum=0, delta=[0,1,2,3,4,-4,-3,-2,-1,0], 
			deltaIndex, deltaValue;

			for (var i=0; i<originalStr.length; i++ ){
				sum += parseInt(originalStr.substring(i,i+1));
			}

			for (var i=originalStr.length-1; i>=0; i-=2){		
				sum += delta[parseInt(originalStr.substring(i,i+1))];
			}	

			if (10-(sum%10)===10){ return 0; }
			return 10-(sum%10);

		},

		// validation of luhn string, should be always true and we can
		// luhn sum is last number of string and should be always from
		// zero to nine
		validate : function(luhnStr){

			var luhnStrDigit, luhnStrLess;

			luhnStrDigit = parseInt(luhnStr.substring(luhnStr.length-1,luhnStr.length));
			luhnStrLess = luhnStr.substring(0,luhnStr.length-1);

			if (this.calculate(luhnStrLess)===parseInt(luhnStrDigit)){ return true; }	
			return false;

		}
	
	
	};	
	
	
	obj.random = {
		
		// fingerprint is connected uniq miliseconds and random number from
		// 100 to 900 (to have same lenght) and one number which provides
		// control sum (luhn function)
		generate : function(){
			
			var random, luhnSum;
			random = Math.floor((Math.random()*800)+100) + new Date().getTime() - 1000000000000 + '';
			luhnSum = obj.luhn.calculate(random);
			
			return parseInt(random + luhnSum);
			
		},
		
		
		// fingerprint is only short way how write longer number in deca base
		// we can also get real value of fingerprint with simple conversion 
		// from 36base string to number and after to string
		encrypt : function(finterprint){

			return parseInt(finterprint, 36)+'';
			
		}
	
	};
	
	
	obj.fingerprint = function(string) {
		
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

