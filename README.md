
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