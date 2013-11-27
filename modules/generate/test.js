module.exports = function(req, res) {


	require('./checkrouting')(req, res, function(rules){
		res.send(rules);
	});

	
};