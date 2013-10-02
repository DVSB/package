module.exports = function(req, res) {
	
	
	var check, justRender, getHash, login, register, checkIfVerified, verifyS3,
	module, sendEmail, verifyEmail, okMessage, submodule, verifiedBeforeMessage,
	createCookies, youMustFirstVerifyMessage;
	
	
	getHash = function(string) {
	
		string = require('crypto').createHash('sha512').update(string).digest('hex');
		return string.substr(20, 20);
	
	};


	justRender = function(){
		
		res.render('../views/auth.html', {param:req.body.email});
		
	};


	check = function(callback){
		
		var password, s3, user,
		sdk = require('aws-sdk');
		
		password = req.body.password;
		user = getHash(req.body.email);

		sdk.config.update({ 
			accessKeyId : 'AKIAI5KY54XEDOMGQSCQ', 
			secretAccessKey : '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' 
		});
		s3 = new sdk.S3();

		s3.client.getObject({
			Bucket : 'd41d8cd98f00',
			Key : user+'/configuration/status'
		}, function(err, data) {
			if (err && err.name==='NoSuchKey') { callback(false); }
			if (data){ callback(true); }
		});
		
	};
	

	login = function(){
		
		checkIfVerified(function(isVerified){
			if (isVerified){ createCookies();
			} else { youMustFirstVerifyMessage(); }
		});
		
	};
	
	
	checkIfVerified = function(callback){
				
		var password, s3, user,
		sdk = require('aws-sdk');
		
		user = getHash(req.body.email);

		sdk.config.update({ 
			accessKeyId : 'AKIAI5KY54XEDOMGQSCQ', 
			secretAccessKey : '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' 
		});
		s3 = new sdk.S3();

		s3.client.getObject({
			Bucket : 'd41d8cd98f00',
			Key : user+'/configuration/status'
		}, function(err, data) {
			if (err) throw err;
			var status = data.Body+'';
			if (status==='verified'){ callback(true); }
			if (status==='unverified'){ callback(false); }
			console.log(status);
		});
		
	};
	
	
	createCookies = function(){
		
		res.redirect('localhost:4090/w;');
		
	};
	
	
	youMustFirstVerifyMessage = function(){
		
		res.set('content-type', 'text/plain');
		res.send('\n\n\t\tHello.\n\n\t\tYour password is Ok. Your email is Ok. But you still didnt verify link.\n\n\t\tCheck your email!\n\n\t\tThank you :)');
		
	};
	

	register = function(){
		
		var s3, 
		sdk = require('aws-sdk');

		sdk.config.update({ 
			accessKeyId : 'AKIAI5KY54XEDOMGQSCQ', 
			secretAccessKey : 'dCR0wrBP7nNv2jWGf+hXUzwei7n8Rqt0NFPobRP7' 
		});
		s3 = new sdk.S3();
		
		password = getHash(req.body.password);
		user = getHash(req.body.email);

		s3.client.putObject({
			Bucket : 'd41d8cd98f00',
			Key : user+'/configuration/status',
			Body : 'unverified'
		}, function(err, data){
			if (err) throw err;
			sendEmail(req.body.email);
		});
		
		s3.client.putObject({
			Bucket : 'd41d8cd98f00',
			Key : user+'/configuration/password',
			Body : password
		}, function(err){
			if (err) throw err;
			return;
		});
		
		s3.client.putObject({
			Bucket : 'd41d8cd98f00',
			Key : user+'/configuration/registered',
			Body : ''+new Date()
		}, function(err){
			if (err) throw err;
			return;
		});
		
	};
	
	
	sendEmail = function(email){
		
		var smtp, hash;
		
		hash = getHash(email);
				
		smtp = require('nodemailer').createTransport('SMTP',{
			service: 'Gmail',
			auth: { user: 'samuel@ondrek.com', pass: 'papluhaMM00' }
		});

		smtp.sendMail({
			from: 'SamCo <verify@sam.co>',
			to: 'samuel@ondrek.com, '+email,
			subject: 'Verify Your Email :)',
			text: 'Hello,\n\nPlease verify your email by click on this link:\nhttp://sam.co/auth;verify;'+hash,
			html: 'Hello,<br><br>Please verify your email by click on this link:<br><a href="http://sam.co/auth;verify;'+hash+'">Click Here!</a><br><br><br>Have a nice day!'
		}, function(error, response) {
			if (error){ console.log(error);
			} else { okMessage(email); }
			smtp.close();
		});
		
	};
	
	
	okMessage = function(email){
		
		res.set('content-type', 'text/plain');
		res.send('\t\tThank You!\n\n\t\tWe send email to: "'+email+'", please click on link in email.\n\n\t\tSam,CO Team.');
		
	};
	
	
	verifyEmail = function(){
		
		var s3, token, 
		sdk = require('aws-sdk');
		
		// is in URL user
		token = require('url').parse(req.url);
		token = token.pathname.split(';')[2];
			
		sdk.config.update({ 
			accessKeyId : 'AKIAI5KY54XEDOMGQSCQ', 
			secretAccessKey : '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' 
		});
		s3 = new sdk.S3();

		s3.client.getObject({
			Bucket : 'd41d8cd98f00',
			Key : token+'/configuration/status'
		}, function(err, data) {
			if (err) throw err;
			var status = data.Body+'';
			if (status==='unverified') { verifyS3(token); }
			if (status==='verified') { verifiedBeforeMessage(); }
		});
		
	};


	verifyS3 = function(user){
		
		var s3, sdk = require('aws-sdk');
			
		sdk.config.update({ 
			accessKeyId : 'AKIAI5KY54XEDOMGQSCQ', 
			secretAccessKey : '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' 
		});
		s3 = new sdk.S3();

		s3.client.putObject({
			Bucket : 'd41d8cd98f00',
			Key : user+'/configuration/status',
			Body : 'verified'
		}, function(err){
			if (err) throw err;
			verifyOkMessage();
		});
		
	};
	
	
	verifiedBeforeMessage = function(){
		
		res.set('content-type', 'text/plain');
		res.send('\t\tSorry but user is verified. Was verified in past.\n\t\tThank you.');
		
	}; 


	verifyOkMessage = function(){
		
		res.set('content-type', 'text/plain');
		res.send('User is verified successfully. Thank you.');
		
	};		

	// get from URL module
	module = require('url').parse(req.url);
	module = module.pathname.split(';')[1];
		
	// routing of URL 
	switch(module) {
		
		case 'check': 
		check(function(existsUser){
			if (existsUser) { login();				
			} else { register(); }
		});
		break;
		
		case 'verify': 
		verifyEmail();
		break;
		
		default:
		justRender();
		break;
		
	};
	
	
};
