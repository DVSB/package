module.exports = function(req, res) {
	
	var options = { signed: true, httpOnly: true };
	res.cookie('fingerprint', 'false', options);
	res.cookie('islogged', 'null', options);
	res.cookie('publickey', 'null', options);
	
	res.redirect('/');
	
};