module.exports = function(req, res) {
	
	var user, userId, module, file, createNewAndRedirect, root, 
	getHash, browseAll, checkIfExistUser, browseUser;


	root = function() {
		
		var hello = '';
		hello += 'localhost:4090/list;\n';
		hello += 'localhost:4090/list;users;';
	
		res.set('content-type', 'text/plain');
		res.send(hello);
	
	};
	
	
	listUsers = function() {
		
		var s3,
		sdk = require('aws-sdk');
		
		filter = function(files){
			files.forEach(function(ele, i){
				ele = 'localhost:4090/list;'+ele.Prefix;
			    files[i] = ele.substring(0, ele.length-1)+';';
			});
			res.set('content-type', 'text/plain');
			res.send(files);
		}

		sdk.config.update({ 
			accessKeyId : 'AKIAI5KY54XEDOMGQSCQ', 
			secretAccessKey : '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' 
		});
		s3 = new sdk.S3();
	
		s3.client.listObjects({
			Bucket : 'd41d8cd98f00',
			Delimiter : '/'
		}, function(err, data){
			if (err) throw err;
			filter(data.CommonPrefixes);
		});
		
		
	};


	getHash = function(string) {
	
		string = require('crypto').createHash('sha512').update(string).digest('hex');
		return string.substr(20, 20);
	
	};
	
	
	browseUser = function() {
	
		var s3, user, filter,
		sdk = require('aws-sdk');
				
		// is in URL user
		user = require('url').parse(req.url);
		user = user.pathname.substr(6);
		user = user.substr(0, user.length-1);
		
		filter = function(files){
			files.forEach(function(ele){
				delete ele.ETag;
				delete ele.Owner;
				delete ele.StorageClass;
				ele.Key = ele.Key.substr((user+'/').length);
				ele.Hash = getHash(ele.Key);
			});
			res.set('content-type', 'text/plain');
			res.send(files);
		};
		
		sdk.config.update({ 
			accessKeyId : 'AKIAI5KY54XEDOMGQSCQ', 
			secretAccessKey : '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' 
		});
		s3 = new sdk.S3();

		s3.client.listObjects({
			Bucket : 'd41d8cd98f00',
			Prefix : user
		}, function(err, data) {
			if (err) throw err;
			filter(data.Contents);
		});
		
	};


	checkIfExistUser = function(user, callback) {

		var s3,
		sdk = require('aws-sdk');

		sdk.config.update({ 
			accessKeyId : 'AKIAI5KY54XEDOMGQSCQ', 
			secretAccessKey : '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' 
		});
		s3 = new sdk.S3();

		s3.client.getObject({
			Bucket : 'd41d8cd98f00',
			Key : user+'/configuration/isExist'
		}, function(err, data) {
			if (err && err.name==='NoSuchKey') { callback(false); }
			if (data){ callback(true); }
		});
	
	};


	createNewAndRedirect = function(user, callback) {
	
		var s3,
		sdk = require('aws-sdk');

		sdk.config.update({ 
			accessKeyId : 'AKIAI5KY54XEDOMGQSCQ', 
			secretAccessKey : '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' 
		});
		s3 = new sdk.S3();
		
		user = getHash('3saddsa1');

		s3.client.putObject({
			Bucket : 'd41d8cd98f00',
			Key : user+'/configuration/isExist',
			Body : 'true'
		}, function(err, data){
			if (err) throw err;
			// res.redirect('/'+user+'/');
			res.send(data);
		});
	
	};


	// get from URL module
	module = require('url').parse(req.url);
	module = module.pathname.substr(6);
	
	// is in URL user
	isUser = require('url').parse(req.url);
	isUser = (isUser.pathname.substr(6).length)===21;
	
	// routing of URL 
	switch(module) {
		
		case 'users;': 
		listUsers();
		break;
		
		case '':
		root();
		break;
		
		default:
		if (isUser){ browseUser(); }
		break;
	}
	
	
	

};































