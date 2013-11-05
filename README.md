

	README
	
	nechal som rozbite dashboard
	predpokladam ze pri registracii som zle vytvoril list of blogov
	preto ked browsnem teraz dashboard tak to spadne
	rovnako aj na realnom developmente domene
	
	
	CO TREBA ESTE
	- treba este refactornut dashboard na pekny routing
	- treba vytvorit jedneho ukazkoveho usera
	- treba sa pustit do tvorby realnych tepmatov a blogu
 	=> posledny krok









	## theme-module
	
		### blog theme for developers 
		- markup.html
		- stylesheet.css

		### mininews theme for shorts
		- markup.html
		- stylesheet.css
	
		### theme for huge website
		- markup.html
		- stylesheet.css
	
	# pointa
	
	chcem zahrnut najvacsie mnozstvo vyvojarov webstranok =>
	- jednoducha sprava pre klienta
	- jednoducha ale rozsiritelna sprava pre admina
	- simple theming pre variabilitu
	- vlastna struktura
		
	# projekty
	
	staticka sajta pre firmu
	staticka sajta pre restauracie
	staticka sajta pre mesto
	
	konkurencia wordpress, joomla, drupal
	
	jednoducha sprava contentu
	velka rozsiritelnost
	
	blogs
	

	article = { 
		markdown, 
		tagspublic { author, date, title }
	 	tagsprivate {  } 
	}
	
	user = {
		details { password, isverified, email },
		keys { private, public },
		modules { blog, images, thumbnails, 
			redirecting // user can redirect 
		}
	}
	
	
	## modules
	
	### redirect
	
	  descr:
	  admin can redirect trafic on webpage base on criteria
		
	  table:
	  /blogs/:id 		=> +type=blog +coolurl=:id
	  /about 			=> +type=page +coolurl=about
	  /archive/:id 		=> +type=blog +coolurl=:id
	  /twitter			=> twitter.com/something/id
	  /faceb			=> facebook.com/name
	  /tags/:tag		=> +type=blog +tag=:tag
	  
	### tags
	  
	  desr:
	  every article is json and can have unlimited tags
	  
	  tags.json {
	  	title { 282882, 282888, 282801, 282981, 282993 },
		coolurl { 282888, 282801, 282981, 282993 },
		pwrd { 282882, 282981, 282993 },
		author { 282801, 282981, 282882, 282888, 282801, 282981, 282993 }
	  }
	  
	  how:
	  article.json { 
	  	markdown, 
		tags { title, id .. thumbnailurl, pwrd, coolurl, author, date, tags } 
	  }
	  
	  process:
	  
	    user browse some article 
	  	=> get article.json 
		=> use tags in own template
		
	    user wants browse all tagged:
		=> get tags.json
		=> get ids or all articles
		=> put list there
