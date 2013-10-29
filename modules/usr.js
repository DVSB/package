module.exports = function(req, res) {

	module = require('url').parse(req.url).path.split('/')[2].split('?')[0];
	module = (module==='') ? null : module;

	switch(module) {
		
		// form
	
		case 'formRegister':
		isUserExists(req.body.registerEmail, function(yes) {
			if (!yes) { 
				createNewUser();
			} else { res.redirect('/errors/e204'); }
		});
		break;
	
		case 'formLogin': 
		isUserExists(req.body.loginEmail, function(yes){
			if (yes) { loginUser();
			} else { res.redirect('/errors/e203'); }
		});
		break;

		case 'formReset': 
		isUserExists(req.body.resetEmail, function(yes){
			if (yes) { resetPassw();
			} else { res.send('sorry, this user doesnt exists'); }
		});
		break;
		
		// email
		
		case 'emailVerify': 
		verifyAccountFromEmail();
		break;
		
		case 'emailResetPass': 
		verifyKeyForResetPassword();
		break;
		
		
		
		// display
	
		case 'login':
	 	res.render('usr.html', { show : 'login' });
		break;
		
		case 'reset':
	 	res.render('usr.html', { show : 'reset' });
		break;

		case 'register':
		res.render('usr.html', { show : 'register' });
		break;
		
		// default

		default:
		res.redirect('./register');
		break;
	
	};
	
};

