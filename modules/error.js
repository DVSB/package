module.exports = function(req, res) {
	
	var underscore = require('underscore');
	underscore.mixin(require('underscore.string').exports());

	var error = underscore.words(req.url, '/')[1];	
	var errorDirName = __dirname+'/../views/error/error.html';
	
	switch(error) {
	
		case 'e001' :
			res.render(errorDirName, {error : {
				name : 'name',
				message : 'message'
			}});
			break;
		
		case 'as87a0d5ad' :
			console.log('*');
			break;

		default :
			res.render(errorDirName, {error:{
				name : 'unknown',
				message : 'unknown'
			}});
			break;

	} // switch

};