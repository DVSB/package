module.exports = function(req, res) {
	
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
		
	}
	
	email.verifyAccount = function(email, verifyHash, callback){
		
		var
		text = '',
		html = '';
		
		text += 'Hello,\n\n',
		text += 'Please visit this URL for verification of account:\n';
		text += 'http://mdown.co/usr/verify?'+verifyHash;
		
		html += 'Hello,<br><br>';
		html += 'Please verify your email by click on this link:<br>';
		html += '<a href="http://mdown.co/usr/verify?'+verifyHash;
		html += '">Click Here!</a><br><br><br>Have a nice day!';
		
		rawEmail(email, 'Verification email', text, html, function(){
			callback();
		})
		
	};

	return email;	
	
};
