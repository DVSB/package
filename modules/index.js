module.exports = function(req, res) {
	

// variables


	var crypto = require('crypto');
	var fs = require('fs');
	var AWS = require('aws-sdk');
	var settings = JSON.parse(require('fs').readFileSync('_settings.json')).settings;


	var underscore = require('underscore');
	underscore.mixin(require('underscore.string').exports());
			
	var s3 = new AWS.S3({ 
		accessKeyId : settings.awsId, 
		secretAccessKey : settings.awsKey, 
		region : settings.region,
		bucket : settings.bucket,
		storage : settings.storage
	});
	
	var mongoclient = require('mongodb').MongoClient;
	var mongoDb = 'mongodb://nodejitsu:c73928b8cc2e315b339c263e5f6c95a1@dharma.mongohq.com:10066/nodejitsudb2231254279';
		
	mongoclient.connect(mongoDb, function(err, db) {
		
		var collection = db.collection('users');
		
		/*
		collection.insert(user, function(err, data) {  
			err ? res.send(err) : res.send(data);
			db.close();
		}); 
		*/
		
		/*
		collection.find().toArray(function(err, results) {
			res.send(results);
		});
		*/
		
	});

// functions


	var validation = function(callback){
	
		var password = req.body.password;
		password.length<=6 ? res.send('ERR: Your password is short, please you longer than 6 characters.') : false;

		callback();
	
	};
	
	
	var signup = function(){
		
		var newUser = {
			name : req.body.name,
			surname : req.body.surname,
			regtime : Date.now(),
			card : {
				name : '', number : '', expiration : '', ccv : ''
			},
			verified : false
		};
		
		newUser.email = crypto.createHash('sha512').update(req.body.email + settings.hash).digest('hex');
		newUser.email = newUser.email.substr(0, 30);
		
		newUser.password = crypto.createHash('sha512').update(req.body.password + settings.hash).digest('hex');
		newUser.password = newUser.password.substr(0, 30);
		
		saveOnS3ifNotExists(newUser);
	
	};
	
	
	var saveOnS3ifNotExists = function(newUser){
				
		mongoclient.connect(mongoDb, function(err, db) {
		
			var collection = db.collection('users');
			
			var createNewOne = function(){
				collection.insert(newUser, function(err, data) {  
					err ? res.send(err) : res.send(data);
					db.close();
				});
			};
	
			collection.find({
				'email' : newUser.email
			}).toArray(function(err, results) {
				err ? res.send(err) : false;
				results.length===0 ? createNewOne() : res.send('user with this email exists, if its you, reset yours password');
			});
		
		});
		
	};


	var sendEmail = function(user){
				
		var nodemailer = require('nodemailer').createTransport('SMTP', {
			host: 'smtp.websupport.sk',
			secureConnection: true,
			port: 465,
		    auth: { user: "support@n200.org", pass: "testtesttest..." }
		});
		
		var verifyLink = crypto.createHash('sha512').update(req.body.email + user.regtime + settings.hash).digest('hex');
		verifyLink = verifyLink.substr(0, 8);
		verifyLink = 'http://n200.org/security/#verify/' + verifyLink;
		
		res.send(verifyLink);
		
		nodemailer.sendMail({
		    from: "Support n200 <support@n200.org>", 
		    to: req.body.email,
		    subject: "Activate n200 Account!",
		    text: 'Hello ' + req.body.name + '! \n\nYour registration was successfull! \nPlease click on link to verify, that this is really your\'s email! \n\n >> ' + verifyLink + '\n\nThank you! \nn200 Team.'
		}, function(err, response){
			err ? res.send(err) : false;
			res.send("Please check your email and click to activation link .. to verify account.");
		    nodemailer.close();
		});
	
	};


// routing and variables


	switch(req.body.action) {
		
		case 'signup' :
			validation(function(){
				signup();
			});
			break;
			
		case 'as87a0d5ad' :
			console.log('* Upload Model runned');
			break;

		default :
			//DefaultUpload();
			res.render(__dirname+'/../views/_.html');
			break;

	} // switch

};