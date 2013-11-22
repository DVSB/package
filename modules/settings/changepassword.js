module.exports = function(req, res) {

    /*
	
	if (!req.body.oldpass || !req.body.newpass || !req.body.newpass2
	|| req.body.newpass!==req.body.newpass2 || req.body.newpass.length<7) {
		res.redirect('/errors/e207');
		return;
	}


	var s3 = require('../../api/s3')(), getConfing, uploadNewConfig,
	cookies=req.signedCookies, changePassword;


	getConfing = function(){

		s3.getObject({
			Key : cookies.userid+'/_configuration/user.json'
		}, function(data){
			data = JSON.parse(data.Body+'');
			comparePasswords(data);
		});

	};


	comparePasswords = function(data){

		fingerprint = require('../../api/fingerprint')().get;

		dbpass = data.details.password;
		oldpass = fingerprint(req.body.oldpass);
		newpass = fingerprint(req.body.newpass);

		if (dbpass===oldpass){
			data.details.password = newpass;
			changePassword(data);
		} else { res.redirect('/errors/e208') }

	};


	changePassword = function(data){

		s3.putObject({
			Key : cookies.userid+'/_configuration/user.json',
			Body : JSON.stringify(data)
		}, function(){
			res.redirect('/errors/i204')
		});

	};


	getConfing();

    */
	
	
};
