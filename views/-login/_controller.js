
	
	var underscore = require('underscore');
	underscore.mixin(require('underscore.string').exports());
	
	'use strict';
	

	exports.Init = function(app, req, res) {

		if (req.body.svc==='14d0d42b9ffaa19a3797fc1760c4fdce') {
			if (CheckCredentials(req, res)) {
				res.send('200', 'Prihlaseny!'); 
			}
			if (!CheckCredentials(req, res)) {
				res.send('200', 'Domena je zla!'); 
			}
		}
			
		res.render(__dirname + '/_view.html');

		};

	
	// Check sent DOMAIN AND PASSWORD and LOGIN
	function CheckCredentials(req) {
	
		var fs = require('fs');
		var allBuckets = require('../../global-api/global-object').AllBuckets();
		
		// Hash password which is sent from screen
		var sentPassword = require('../../global-api/cryptography.js').Hash(req.body.password);
		
		// Check if sent domain is exist in Storage
		var isUniq = underscore.find(allBuckets, function(item){ 
			return (item===req.body.domain);	
		});
		
		var administrator;
		
		// If user is registrated (domain folder exists), read exists password, else die
		if (!underscore.isUndefined(isUniq)) {
			administrator = fs.readFileSync('tmp-storage/bucket-' + req.body.domain + '/Administrator.json', 'utf8');
			administrator = JSON.parse(administrator);
		} else {
			// Domain OR PASSWORD doesnt exists
			return false;
		}
		
		// If Domain exists AND Password is correct return TRUE
		if ((!underscore.isUndefined(isUniq)) && (sentPassword===administrator.password)) { 
			return true;
		} else {
			return false;
		}
		
	}

	/* Check credentials and set cookies if password and username is correct
	function LogInAndCreateCookies(req, res) {

		var name = 'tmp-storage/bucket-' + req.body.admin.domain;

		var fs = require('fs');
		var ucryptography = require('../../u200api/cryptography.js');
		
		var adminData = fs.readFileSync(name + '/_aboutme.json'); 
		adminData = JSON.parse(adminData);
		
		if (adminData.password===ucryptography.Hash(req.body.admin.password)) {
			res.cookie('date', Date.now(), { httpOnly: true, expires: new Date(Date.now()+86400000) });
			res.cookie('locale', 'en_EN', { httpOnly: true, expires: new Date(Date.now()+86400000) });
			res.cookie('user', req.body.admin.domain, { httpOnly: true, expires: new Date(Date.now()+86400000) });
		} else {
			console.log('heslo je naprd');
		}
		
		res.set('Location', '/admin');
		res.send(302);
		
	}
	*/