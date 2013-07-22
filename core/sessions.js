
	exports.init = function(){
		
		return {
			
			sessionLogin : function(req, res, email) {
				var core = res.locals.core;		
				req.session.email = email;		
				req.session.presence = core.settings.hash1.substr(0, 10);
			},
			
			sessionLogout : function(user) {
				//console.log(user);
			},
			
			sessionUpdate : function(user) {
				//console.log(user);
			}
			
		};
	
	};
