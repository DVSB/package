module.exports = function() {
	
	
	var smtp, email={}, rawEmail;
	
						
	smtp = require('nodemailer').createTransport('SMTP', {
		service: 'Gmail',
		auth: { user: 'samuel@ondrek.com', pass: 'papluhaMM00' }
	});
	
	
	rawEmail = function(to, subject, text, html, callback){
		
		smtp.sendMail({
			from: 'mdown <support@mdown.co>', to: to, subject: subject, text: text, html: html
		}, function(err, data) {
			if (err) throw err;
			callback();
		});
		
	};
	
	
	email.resetPassword = function(email, verifyHash, callback){
		
		var
		text = '',
		html = '';
		
		text += 'Hello,\n\n',
		text += 'On your account was requested new password:\n';
		text += 'If you dont want reset password, ignore this message:\n';
		text += 'http://mdown.co/usr/emailResetPass?'+verifyHash;
		
		html += 'Hello,<br><br>';
		html += 'On your account was requested new password:<br>';
		text += 'If you dont want reset password, ignore this message:<br>';
		html += '<a href="http://mdown.co/usr/emailResetPass?'+verifyHash;
		html += '">Click Here!</a><br><br><br>Have a nice day!';
		
		rawEmail(email, 'Reset password on mDown?', text, html, function(){
			callback();
		});
				
	};
	
	
	email.verifyAccount = function(email, verifyHash, callback){
		
		var
		text = '',
		html = '';
		
		text += 'Hello,\n\n',
		text += 'Please visit this URL for verification of account:\n';
		text += 'http://mdown.co/usr/emailVerify?'+verifyHash;
		
		html += 'Hello,<br><br>';
		html += 'Please verify your email by click on this link:<br>';
		html += '<a href="http://mdown.co/usr/emailVerify?'+verifyHash;
		html += '">Click Here!</a><br><br><br>Have a nice day!';
		
		rawEmail(email, 'Verification email!', text, html, function(){
			callback();
		});
		
	};


	return email;	
	
	
};
