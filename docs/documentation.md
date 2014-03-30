# DOCS

## package.json configurations


	"localhost-port" : "8088"
	"dir-templates" : "%templates"
	"dir-build" : "%build"
	"watch-interval" : "50",
    "watch-interval-binaries" : "300",
    "watch-ignored" : /%build/
    "markdown-delimiter" : "---"


## global object


	{
		package : {...},
		config : {...),
		statics : [...],
		templates : {...}
	}


## template > templates


	{
		blog : "<DOCTYPE..",
		blogs : "<DOCTYPE..",
		category : "<DOCTYPE..",
		index : "<DOCTYPE.."
	}


## template > statics


    [
        {
            _name: 'cover.jpg',
            _extension: 'jpg',
            _size: 251203,
            _path: './blog/trip-in-europe/cover.jpg',
            _uniqid: 'zzdr'
        },
        {
            _name: 'index.md',
            _extension: 'md',
            _size: 4107,
            _path: './blog/trip-in-europe/index.md',
            _uniqid: '10pai'
        },
        {
            _name: 'index.md',
            _extension: 'md',
            _size: 491,
            _path: './contact/index.md',
            _uniqid: 'vpsc'
        },
        {
            _name: 'index.md',
            _extension: 'md',
            _size: 25,
            _path: './index.md',
            _uniqid: 'k45d'
        }
    ]


## template > markdowns


    [
        {
            title: 'Memories from Spain',
            template: 'blog',
            description: 'Nam vulputate elementu ...',
            _path: '/blog/memories-from-spain/',
            _origin: '/blog/memories-from-spain/index.md',
            _target: '/blog/memories-from-spain/index.html',
            _uniqid: 'uabb',
            _content: '<p>Nam vulputate elementum lac ...'
        },
        {
            title: 'Trip in Europe 2',
            template: 'blog',
            description: 'Nam vulputate elementum la ...',
            _path: '/blog/trip-in-europe/',
            _origin: '/blog/trip-in-europe/index.md',
            _target: '/blog/trip-in-europe/index.html',
            _uniqid: 'rq8n',
            _content: '<p>Duis ultricies ...'
        },
        {
            template: 'page',
            _path: '/',
            _origin: '/sample.md',
            _target: '/sample.html',
            _uniqid: 'g2lo',
            _content: '<h2 id="page-sam ...'
        }
    ]
