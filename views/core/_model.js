
	exports.browse = function(req, res) {
	
		var browsea = require('./browse');
		
		browsea.GetFiles(function(listOfFiles) {
			browsea.GetFolders(function(listOfFolders) {
				
				console.log(listOfFolders);
				
				/* Create nice folders
				for (var i=0; i<=listOfFolders.length-1; i++) {

					var hexFromFolderKey = 'a'; //crypto.createHash('sha512').update(listOfFolders[i]).digest('hex').substr(0, 8);

					listOfFolders[i] = {
						'Key' : listOfFolders[i],
						'Hash' : hexFromFolderKey
					};

				}*/
				
				// Connect folders and files
				var listOfFoldersAndFiles = listOfFolders.concat(listOfFiles);
				
				console.log(listOfFoldersAndFiles);

				res.render(__dirname + '/../_view.html', {myfiles : listOfFoldersAndFiles});

			});
		});

	};
	