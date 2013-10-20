module.exports = function(req, res) {
	
	var signup, saveNewUser, checkUser, checkPassAndLogin, login,
	s3 = require('./_api')().s3, 
	superhash = require('./_api')().superhash;	

	
	checkIfExist = function() {
						
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
		
		var arePassEqual;
		
		arePassEqual = function(user){
			return (user.password===superhash.get(req.body.password));
		}
		
		s3.getUser({
			key : superhash.get(req.body.email)
		}, function(data){
			var userDetails = data.Body+'';
			userDetails = JSON.parse(userDetails);
			if (arePassEqual(userDetails)) { login() 
			} else { res.send('sorry, passwords are not equal'); }
		});
		
	};
	
	console.log(req.cookies);
	console.log(req.signedCookies);
		
	//res.cookie('logged', 'true', { signed: false });
	//res.cookie('loggedSecure', 'samuelondrek', { signed: true });
	
	console.log(req.cookies);
	console.log(req.signedCookies);
	
	res.send('check console');
	
	
	
	login = function(){
		
		console.log(req.cookies);
		
		req.cookies.logged = 'true';
		res.send(req.cookies);
		
	}
	

	module = require('url').parse(req.url);
	module = module.pathname.split('/')[2];	
	
	// routing of URL 
	switch(module) {
		
		case 'signup': 
		checkIfExist();
		break;
		
		default:
		res.render('usr.html');
		break;
		
	};
	
	
};

