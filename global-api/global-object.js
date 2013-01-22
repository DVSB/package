	
	var underscore = require('underscore');
	underscore.mixin(require('underscore.string').exports());
		

	exports.ViewsList = function() {
	
		// Get all files from /views folder
		var files = require('fs').readdirSync(__dirname + '/../views');
		

				
		// Filter to only folders which starst with "view-"
		var filtered = underscore.filter(files, function(item) {
			return underscore(item).startsWith("view-"); 
		});
		
		for (var i=0; i<filtered.length; i++) {
			filtered[i] = underscore(filtered[i].toString()).splice(0, 5);
		}
		
		return filtered;
		
	};
	
	exports.AllBuckets = function() {
	
		// Get all files from /storage folder
		var files = require('fs').readdirSync(__dirname + '/../tmp-storage');
				
		// Filter to only folders which starst with "view-"
		var filtered = underscore.filter(files, function(item) {
			return underscore(item).startsWith("bucket-"); 
		});
		
		for (var i=0; i<filtered.length; i++) {
			filtered[i] = underscore(filtered[i].toString()).splice(0, 7);
		}
		
		return filtered;
		
	};