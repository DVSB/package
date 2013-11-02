module.exports = function(req, res) {
	
	// this module is runned if user haven't correct cookies
	// this means that he is or unlogged, or not logged, or
	// on website first time, its real index but root (/) is 
	// used also after login for dashboard, thats reason why firsttouch
	
	res.render('index.html');

};
