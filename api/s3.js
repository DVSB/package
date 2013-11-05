module.exports = function() {
	
	var
	sdk = require('aws-sdk')
	s3={},
	settings = require('fs').readFileSync('settings.json');
	
	settings = JSON.parse(settings);
	
	s3original = new sdk.S3({ 
		accessKeyId : settings.amazon.accessKeyId, 
		secretAccessKey : settings.amazon.secretAccessKey,
		s3: settings.amazon.apiVersion
	});
	
		
	// putobject to s3 is internal api and should have in future
	// also more functions after callback, like metatags or like
	// storageclass or enryption settings..
	s3.putObject = function(params, callback){
	
		s3original.client.putObject({
			Body : params.Body,
			Key : params.Key,
			Bucket : params.Bucket,
			StorageClass : 'REDUCED_REDUNDANCY',
			ServerSideEncryption : 'AES256',
			ContentType : 'text/plain' || params.ContentType
		}, function(err, data){
			if (err) throw err;
			callback(data);
		});
	
	};
	
	// list all objects in s3, if prefix is empty list all files
	// in bucket, we can define prefix, delimiter and markers and
	// all are optional
	s3.listObjects = function(params, callback){
		
		s3original.client.listObjects({
			Bucket : params.Bucket,
			Prefix : params.Prefix
		}, function(err, data){
			if (err) throw err;
			callback(data);
		});
	
	};
	
	// get object from s3, only key is required, always should
	// be defined with callback
	s3.getObject = function(params, callback){
		
		s3original.client.getObject({
			Bucket : params.Bucket,
			Key : params.Key
		}, function(err, data){
			if (err) throw err;
			callback(data);
		});
	
	};
	
	// remove object from datastore, can be used for remove whole
	// user but also for removing only article or module, be affraid
	// with this module
	s3.deleteObjects = function(params, callback){
		
		s3original.client.deleteObjects({
			Bucket : params.Bucket,
			Delete : params.Delete
		}, function(err, data){
			if (err) throw err;
			callback(data);
		});
	
	};

	s3.deleteObject = function(params, callback){
		
		s3original.client.deleteObject({
			Bucket : params.Bucket,
			Key : params.Key
		}, function(err, data){
			if (err) throw err;
			callback(data);
		});
	
	};
		
	
	s3.isObjectExists = function(params, callback){
		
		s3original.client.getObject({
			Bucket : params.Bucket,
			Key : params.Key
		}, function(err, data){
			if (err && err.name==='NoSuchKey') { callback(false); }
			if (data){ callback(true); }
		});
	
	};
	
	
	s3.copyObject = function(params, callback){
		
		s3original.client.copyObject({
			Bucket : params.Bucket,
			CopySource : params.CopySource,
			Key : params.Key
		}, function(err, data){
			if (err) throw err;
			callback(data);
		});
		
	};

	return s3;
	
};
