# All Files

## Description

This plugin scan the build folder for all files and folders. Returns object with
all files and folders. Extended functionality can be added later.

## Dependencies

	- "build_create"

## Configuration

	{
		"mdown" : {
			"ignored" : ["/%", "/."]
		}
	}

## Returns

	{
		folders : [ "/folder1", "/folder2", "/folder3" ],
		files : [ "/anyfile.html", "/nextmarkdown.md", "/blog/mynewblog.md" ],
		theme : { "name1" : "content", "name2" : "content", "name3" : "content" }
	)

## Functionality

 1. Read all files from folder
 2. Filter which one is folder and which one is file
 3. Remove ignored folders and files, which are defined in `package.json`
 4. Read `%theme` folder and create associative array
 5. Finish plugin and call the callback

## Credits

Samuel Ondrek, @ondrek

