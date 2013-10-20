module.exports = function(req, res) {
	
	var signup, saveNewUser, checkUser, checkPassAndLogin
	s3 = require('./_api')().s3, 
	superhash = require('./_api')().superhash;	

	
	signup = function() {
						
		// if empty response without email
		if (req.body.email==='' || req.body.password==='' || Object.keys(req.body).length===0) { 
			res.redirect('/usr/'); return; }
	
		s3.isUserExists({
			key : superhash.get(req.body.email)
		}, function(answer){
			if (answer) { checkUser()
			} else {	saveNewUser() }
		});
		
	};
	
	
	saveNewUser = function(){
				
		s3.putUser({
			key : superhash.get(req.body.email),
			body : JSON.stringify({ password : superhash.get(req.body.password) }),
		}, function(data){
			res.redirect('/usr/');
		});
		
	};
	
	
	checkUser = function(){
		
		// if empty response without email
		if (request.email==='' || request.password==='' || Object.keys(request).length===0) { 
			res.redirect('/usr/login'); return; }
						
		checkIfUserExists(request.email, function(isExists, data){
			if (isExists) { checkPassAndLogin(data.Body+'');
			} else { res.send('User Not Exists. Please register first.');  } 
		});
					
	};
	
	
	checkPassAndLogin = function(hashedPassword){
		
		savedPass = JSON.parse(hashedPassword).password;
		sentPass = getFingerPrint(request.password);
		
		isCorrect = (savedPass===sentPass);
					
	};
	
	
	resetpass = function(){
					
		res.render('usr.html');
					
	};
	

	module = require('url').parse(req.url);
	module = module.pathname.split('/')[2];	
	
	// routing of URL 
	switch(module) {
		
		case 'login': 
		login();
		break;
		
		case 'signup': 
		signup();
		break;
		
		case 'reset': 
		resetpass();
		break;
		
		default:
		res.render('usr.html');
		break;
		
	};
	
	
};

