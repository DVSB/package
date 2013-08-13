module.exports = function(req, res) {
	
	var underscore = require('underscore');
	underscore.mixin(require('underscore.string').exports());

	var error = underscore.words(req.url, '/')[1];	
	var errorDirName = __dirname+'/../views/error/error.html';
	
	switch(error) {
		
		// connection
	
		case 'e001' :
			res.render(errorDirName, {error : {
				name : 'name',
				message : 'message'
			}});
			break;
		
			// registration
		
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