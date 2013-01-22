	
	var underscore = require('underscore');
	underscore.mixin(require('underscore.string').exports());
	
	'use strict';
	

	exports.Init = function(app, req, res) {

		if (req.body.svc==='c95c7fef636dfba0847b26f2560ea42d') {
		
			ValidateForm(req, res, function(){
				CreateBucket(req, res);
			});
			
		}
		
		res.render(__dirname + '/_view.html');

	};
	
	
	// Validation of Regiter fields before CreateBucket()
	function ValidateForm(req, res, callback) {
	
		var check = require('validator').check;
		
		// #github.com/chriso/node-validator#error-handling
		try {
			check(req.body.name, 'Name needs to be Alpha.').isAlpha().toString();
			check(req.body.surname, 'Surname needs to be Alpha.').isAlpha();
			check(req.body.domain, 'Domain needs to be between 6 and 64 chars.').len(6, 64);
			check(req.body.email, 'Email needs to be email.').len(5, 64).isEmail();
			check(req.body.phonePrefix, 'Prefix needs to be between 2 and 5 chars.').len(2, 5);
			check(req.body.phone, 'Number needs to be Numeric.').isNumeric();
			check(req.body.password, 'Passwords needs to be between 6 and 64 chars.').len(6, 64);
		} catch (e) {
			res.send('200', e.message);
		}
		
		callback();
		
	}
	
	
	// Create User Bucket with _aboutme.json file
	function CreateBucket(req) {
	
		var name = 'tmp-storage/bucket-' + req.body.domain;
	
		var fs = require('fs');
		var ucryptography = require('../../global-api/cryptography.js');
				
		var adminJson = JSON.stringify({
			"id" : ucryptography.Hash(),
			"firstname" : req.body.name,
			"surname" : req.body.surname,
			"email" : req.body.email,
			"telephone" : req.body.phonePrefix + req.body.phone,
			"registrated" : Date.now(),
			"password" : ucryptography.Hash(req.body.password),
			"url" : req.body.domain }, null, '\t');
			
		fs.mkdir(name);			
		fs.writeFile(name + '/Administrator.json', adminJson);
		
		// Probably can be commented
		//res.set('Location', '/register'); //req.params.page
		//res.send(302);
		
	}
