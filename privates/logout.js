module.exports = function(req, res) {
	
	var options = { signed: true, httpOnly: true };
	res.cookie('islogged', 'false', options);
	res.cookie('userid', 'null', options);
	res.cookie('userhash', 'null', options);
	
	res.redirect('/');
	
};