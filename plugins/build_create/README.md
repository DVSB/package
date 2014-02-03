# Build Create

## Description

This is very low-level plugin. Is mandatory and should be always activated.
Plugin copy all user files (except folders and files which starts on "%" or ".".
We don't want copy mDown administrator file, build itself and folders like `.svn` or `.git`.

## Configuration

	{
		"mdown" : {
			"ignored" : ["/%", "/."]
		}
	}

## Functionality

 1. Read package.json for options
 2. Remove old build folder "%build" with whole content
 3. Create new empty folder "%build"
 4. Copy all user files (except of ignored)
 5. Finish and Call the plugin callback

## Credits

Samuel Ondrek, @ondrek

