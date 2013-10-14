module.exports = function(req, res) {
	
	var create, s3, sdk = require('aws-sdk'), 
	request=req.body, luhn={};	
	
	
	// luhn implementation
	
	
		luhn.calculate = function(originalStr){

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

		};

		luhn.validate = function(luhnStr){

			var luhnStrDigit, luhnStrLess;

			luhnStrDigit = parseInt(luhnStr.substring(luhnStr.length-1,luhnStr.length));
			luhnStrLess = luhnStr.substring(0,luhnStr.length-1);

			if (this.calculate(luhnStrLess)===parseInt(luhnStrDigit)){ return true; }	
			return false;

		};
	
	
	s3 = new sdk.S3({ 
		accessKeyId : 'AKIAI5KY54XEDOMGQSCQ', 
		secretAccessKey : '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',
		s3: '2006-03-01'
	});
	
	
	create = function() {
		
		var body;
		
		// if empty response without email
		if (request.email==='' || request.password==='' || Object.keys(request).length===0) { 
			res.redirect('/usr/signup'); return; }
		
		checkIfUserExists(request.email, function(isExists){
			if (!isExists) { saveNewUser(); 
			} else { res.send('Sorry, but this user exists!'); } 
		});

	};
	
	
	checkIfUserExists = function(mail, callback){
		
		s3.client.getObject({
			Bucket : 'mdown.users',
			Key : getFingerPrint(mail)
		}, function(err, data){
			if (err && err.name==='NoSuchKey') { callback(false); }
			if (data){ callback(true, data); }
		});
		
	};
	
	
	saveNewUser = function(){
		
		s3.client.putObject({
			Bucket : 'mdown.users',
			Key : getFingerPrint(request.email),
			Body : JSON.stringify({ password : getFingerPrint(request.password) }),
			StorageClass : 'REDUCED_REDUNDANCY',
			ServerSideEncryption : 'AES256',
			ContentType : 'application/json',
			Metadata : {
				'verified' : 'false',
				'paid' : 'false'
			}
		}, function(err, data){
			if (err) throw err;
			console.log('sdaasd');
			res.redirect('/usr/login');
		});
		
	};
	
	
	getUniq = function(){
				
		date = new Date().getTime()+0388293937873+'';		
		return date+luhn.calculate(date);
				
	};
	
	
	getFingerPrint = function(rawString){
					
		rawString = require('crypto').createHash('sha512').update(rawString).digest('hex');
		return rawString.substr(20, 40);
					
	};
	
	
	checkPassAndLogin = function(hashedPassword){
		
		savedPass = JSON.parse(hashedPassword).password;
		sentPass = getFingerPrint(request.password);
		
		isCorrect = (savedPass===sentPass);
		
		
					
	};
	
	
	check = function(){
		
		// if empty response without email
		if (request.email==='' || request.password==='' || Object.keys(request).length===0) { 
			res.redirect('/usr/login'); return; }
						
		checkIfUserExists(request.email, function(isExists, data){
			if (isExists) { checkPassAndLogin(data.Body+'');
			} else { res.send('User Not Exists. Please register first.');  } 
		});
					
	};
	
	
	login = function(){
					
		res.render('usr-login.html');
					
	};
	
	
	signup = function(){
					
		res.render('usr-signup.html');
					
	};
	
	
	resetpass = function(){
					
		res.render('usr-reset.html');
					
	};
	

	module = require('url').parse(req.url);
	module = module.pathname.split('/')[2];	
	
	// routing of URL 
	switch(module) {
		
		case 'new': 
		create();
		break;
		
		case 'login': 
		login();
		break;
		
		case 'signup': 
		signup();
		break;
		
		case 'reset': 
		resetpass();
		break;
		
		case 'check': 
		check();
		break;
		
		default:
		res.redirect('/usr/login');
		break;
		
	};
	
	
};

