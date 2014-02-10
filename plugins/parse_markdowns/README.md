# All Files

## Description

This plugin find all markdown files (except of ignored) and find all markdowns with header.
If the markdown file is not ignored and has no header, it logs warning to console. If yes,
create huge array of markdown objects, and render all objects into. This plugin has more
options and save all new files like HTML files into the build folder.

## Dependencies

	- "build_create"

## Configuration

	{
		"mdown" : {
			"ignored" : ["/%", "/."]
		}
	}

## Allowed objects in theme

	{
		markdowns : [] // list of all markdowns
		_ :  : {}, // underscore
		underscore : {}, // underscore
		files : [] // list of all files
		folders : [] // list of all folders
		theme : content of theme folder
		local : {} // local parsed file object
	}

## Functionality

	// TODO

## Credits

Samuel Ondrek, @ondrek
