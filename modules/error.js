module.exports = function(req, res) {
	
	var underscore = require('underscore');
	underscore.mixin(require('underscore.string').exports());

	var error = underscore.words(req.url, '?')[1];
	var errorDirName = __dirname+'/../views/error.html';
	
	
	switch(error) {
		
		// new error api
		
			// verify account 
	
			case 'e0001' :
			res.render(errorDirName, {
				error : { name: 'Verification key is invalid', message: 'You probably edited URL from email!' }
			});
			break;
		
			case 'd0001' :
			res.render(errorDirName, {
				error : { name : 'Unknow database error', message : 'Unknow database error, TODO.' }
			});
			break;
			
			// registration proccess
			
			case 'r0001' :
			res.render(errorDirName, {
				error : { name : 'Your registration was successfull', message : 'Please check your email box and click to verification link.' }
			});
			break;
		
		// old error api
		
			case 'r001' :
			res.render(errorDirName, {error : {
				name : 'Name is missing',
				message : 'In registration process is missing Name input filled.'
			}});
			break;
			
			case 'r002' :
			res.render(errorDirName, {error : {
				name : 'Surname is missing',
				message : 'In registration process is missing Surname input filled.'
			}});
			break;
			
			case 'r003' :
			res.render(errorDirName, {error : {
				name : 'Product is missing',
				message : 'In registration process is missing Product input filled.'
			}});
			break;
			
			case 'r004' :
			res.render(errorDirName, {error : {
				name : 'Password is short',
				message : 'Password needs to be longer than 6 chars.'
			}});
			break;
			
			// default

			default :
			res.render(errorDirName, {error:{
				name : 'unknown',
				message : 'unknown'
			}});
			break;

	} // switch

};