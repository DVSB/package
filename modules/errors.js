module.exports = function(req, res) {
	
	var module, errors={};
	
	module = require('url').parse(req.url).path.split('/')[2].split('?')[0];
	module = (module==='') ? null : module;
	
	// errors
	
	errors.e200 = {
		error: 'Page not exists', 
		descr: 'UUh :( Sorry, you not should be here, this page doesn`t exists.',
		refer: '/'
	};
	
		errors.e201 = {
			error: 'Log In Error: Wrong password', 
			descr: 'Try use different password. This one is wrong.',
			refer: '/usr/login'
		};
	
		errors.e202 = {
			error: 'Log In Error: User is not verified', 
			descr: 'OOh :( Your account is ready, but, please find email from mDown.',
			refer: '/usr/login'
		};
	
		errors.e203 = {
			error: 'Log In Error: User not exists', 
			descr: 'This email address is not registered yet.',
			refer: '/usr/login'
		};
	
	errors.e204 = {
		error: 'This email already exists', 
		descr: 'Sorry :( but user with this email is already registered.',
		refer: '/'
	};
	
	errors.e205 = {
		error: 'This password is wrong', 
		descr: 'Sorry, we cannot remove this account, because password is wrong.',
		refer: '/'
	};
	
	errors.e206 = {
		error: 'You cannot reset password', 
		descr: 'Sorry, you cannot reset password to this account.',
		refer: '/'
	};
	
	// infos
	
		errors.i200 = {
			error: 'Registration successful', 
			descr: 'Check email box for verification link.',
			refer: '/'
		};
	
	errors.i201 = {
		error: 'Your password was changed successfully', 
		descr: 'Next time you can sign in with new password. We sent you email about this change.',
		refer: '/'
	};
	
		errors.i202 = {
			error: 'Check your email', 
			descr: 'We sent there verification link where you get password.',
			refer: '/usr/login'
		};
	
	routing = function(number){
			
		var params = {}, 
		isExists = errors.hasOwnProperty(number);
		isNotDefined = (errors[number]===undefined);
				
		if (!isExists || isNotDefined){
			res.redirect('/errors/e200');
		} else {
			res.render('errors.html', {
				error : errors[number].error,
				descr : errors[number].descr,
				refer : errors[number].refer
			});
		}
		
		// routing still is redirecting on different number like exists
		
	}
	
	routing(module);
	
};