	# OpenWrap (beta2 now from jun 2013)
	**Copyright 2013, All Rights Reserved**


	Idea:

	hash from email:
	78a0c26b5aed1d222d56d1427b01d740734cc5e7

	saved in database:
	78a0c26b5aed1d222d56d1427b01

	user public key:
	78a0c26b5aed1d2

	## User generating

		http://www.json-generator.com/
		[
		    '{{repeat(5, 7)}}',
		    {
		        name: '{{firstName}}',
		        surname : '{{surname}}',
		        regtime: '{{numeric(1376427638531,1976427638531)}}',
		        card: {
					name : '', 
		            number : '', 
		            expiration : '', 
		            ccv : ''
				},
		        verified: '{{bool}}',
		        email: '{{guid}}',
		        password: '{{guid}}',
		        product : null,
		        key: '{{guid}}', 
		        _id: '{{guid}}'
		    }
		]
	
	## How to install on new PC
	
	- Install NodeJs from `nodejs.org`
	- Install nodemon from npm with `npm install -g nodemon`
	- Run `nodemon _express.js`
	- Browse `localhost:4090`
	
	
	## Credits
	
	Samuel Ondrek