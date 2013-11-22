module.exports = function(req, res) {
	
	
	var cookies = req.signedCookies, resetPassword, removeAccount,
	_api = null;
	
	
	/*
	
	// first we need to get file config in user profile, after
	// we rewrite password from form to json and sent it back
	// to s3, on successfull we write message
	resetPassword = function(){
		
		var newPass = req.body.changeEmail, redirect,
		changePass, oldPass;
		
		if (newPass.length===0) {
			res.send('you should not change pass for empty');
		}
		
		s3.getObject({
			key : cookies.userid+'/user-details/_config.json'
		}, function(data){
			data = JSON.parse(data.Body+'');
			data.password = fingerprint(newPass);
			data = JSON.stringify(data);
			uploadNewConfig(data);
		});
		
		uploadNewConfig = function(data){
			s3.putObject({
				key : cookies.userid+'/user-details/_config.json',
				body : data
			}, function(){
				// successfully done info message
				res.redirect('/errors/i201');
			});
		}
	
	};
	
	
	// for removing account user must type correct password, if
	// is password OK, amazon havent option remove account, but
	// we can still get all files and remove array of them
	removeAccount = function(){
		
		if (req.body.removeAccountPassword===0) {
			res.send('password cannot be empty');
		}
		
		var userId = req.signedCookies.userid, comparePass, removeAccount, removeCookies,
		newPass = fingerprint(req.body.removeAccountPassword), getAll;
		
		s3.getObject({
			key : userId+'/user-details/_config.json'
		}, function(data){
			data = JSON.parse(data.Body+'').password;
			comparePass(data);
		}); 
		
		comparePass = function(nowPassw){
			if (newPass===nowPassw) { getAllFiles();
			} else { res.redirect('/errors/e205'); }
		};
		
		getAllFiles = function(){
			s3.listObjects({
				prefix : userId
			}, function(data){
				data = data.Contents;
				gettedFiles(data);
			});
		};
		
		gettedFiles = function(data){
			data.forEach(function(ele, i){
				data[i] = { Key : ele.Key };
			});
			removeAllFiles(data);
		};
		
		removeAllFiles = function(allFilesArr){
			console.log(allFilesArr);
			s3.deleteObjects({
				Delete : { Objects : allFilesArr }
			}, function(){
				removeCookies();
			});
		};
				
		removeCookies = function(){
			var options;
			options = { signed: true, httpOnly: true };
			res.cookie('islogged', 'false', options);
			res.cookie('userid', 'null', options);
			res.cookie('userhash', 'null', options);
			res.redirect('/');
		};
	
	};
	
	*/

	// Routing
	
	module = req.params[0];
	
	switch (module) {

		case 'formResetPassword': 
		resetPassword();
		break;

		case 'formRemoveAccount': 
		removeAccount();
		break;

		default: 
		res.render('privates/settings.html');
		break;
	
	};
	
};
