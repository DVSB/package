module.exports = function(req, res) {
	
	
	// this module is run only when user is logged and has correct all
	// credentials, if is user here, always should be all comunication
	// checked in every request to prevent hacked cookies and IP adress
	
	
	var cookies = req.signedCookies, getAllArticles, renderArticles, createNew,
	_api = require('./_api')(), s3 = _api.s3, underscore = require('underscore'),
	fingerprint = _api.fingerprint, removeAccount;
	
	
	resetPassword = function(){
		
		var newPass = req.body.changeEmail, redirect,
		changePass, oldPass, uploadNewConfig;
		
		if (newPass.length===0) {
			res.send('you should not change pass for empty');
		}
		
		changePass = function(data){
			data = JSON.parse(data.Body+'');
			console.log(data);
			data.password = fingerprint(newPass);
			console.log(fingerprint(newPass));
			data = JSON.stringify(data);
			uploadNewConfig(data);
		}
		
		uploadNewConfig = function(data){
			s3.putObject({
				key : cookies.userid+'/user-details/_config.json',
				body : data
			}, redirectSomewhere);
		}
		
		redirectSomewhere = function(data){
			res.send('successfully changed pass');
		}
		
		s3.getObject({
			key : cookies.userid+'/user-details/_config.json'
		}, changePass);
	
	};
	
	
	removeAccount = function(){
		
		if (req.body.removeAccountPassword===0) {
			res.send('password cannot be empty');
		}
		
		var userId = req.signedCookies.userid, comparePass, removeAccount, removeCookies,
		newPass = fingerprint(req.body.removeAccountPassword), getAll;
		
		comparePass = function(nowPassw){
			console.log(newPass);
			console.log(nowPassw);
			if (newPass===nowPassw) { getAllFiles();
			} else { res.send('your password is no this one!'); }
		};
		
		removeCookies = function(){
			var options = { signed: true, httpOnly: true };
			res.cookie('islogged', 'false', options);
			res.cookie('userid', 'null', options);
			res.cookie('userhash', 'null', options);
			res.redirect('/');
		}
		
		gettedFiles = function(data){
			data = data.Contents;
			data.forEach(function(ele, i){
				data[i] = { Key : ele.Key };
			});
			removeCookies(data);
		}
		
		getAllFiles = function(){
			s3.listObjects({
				prefix : userId
			}, gettedFiles);
		};
		
		removeAllFiles = function(keysArr){
			s3.deleteObjects({
				Delete : { Objects : keysArr }
			}, function(data){
				console.log(data);
			});
		};
		
		s3.getObject({
			key : userId+'/user-details/_config.json'
		}, function(data){
			data = JSON.parse(data.Body+'').password;
			comparePass(data);
		}); 
	
	};
	
	
	
	getAllArticles = function(){
						
		s3.listObjects({
			prefix : cookies.userid+'/articles/'
		}, function(data){
			articles = data.Contents;
			articles.forEach(function(ele, i){
				articles[i] = underscore.pick(articles[i], 'Key', 'LastModified', 'Size');
				articles[i].Key = articles[i].Key.split('/')[2];
			});
			renderArticles(articles);
		});
		
	};
	
	
	renderArticles = function(articles){
		
		res.render('dashboard.html', { 
			allArticles : articles 
		});
		
	};
	
	
	createNew = function(articles){
		
		res.send('createanew');
				
	};
	
	
	module = require('url').parse(req.url).path.split('/')[2].split('?')[0];
	module = (module==='') ? null : module;
	
	// routing of URL 
	switch(module) {
	
		case 'formResetPassword': 
		resetPassword();
		break;
		
		case 'formRemoveAccount': 
		removeAccount();
		break;
		
		case 'new': 
		createNew();
		break;
	
		default:
		getAllArticles();
		break;
		
	};
	

};
