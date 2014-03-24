# DOCS

## package.json

	"localhost-port" : "8088"
	"dir-templates" : "%templates"
	"dir-build" : "%build"
	"watch-interval" : "50",
    "watch-interval-binaries" : "300",
    "watch-ignored" : /%build/

## global object

	global.downpress = {
		package = {...},
		config = {...)
	}

## downpress.statics

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
        },
        {
            _name: 'package.json',
            _extension: 'json',
            _size: 25,
            _path: './package.json',
            _uniqid: 'byq0'
        },
        {
            _name: 'sample.md',
            _extension: 'md',
            _size: 329,
            _path: './sample.md',
            _uniqid: 's58u'
        }
    ]

## downpress.markdowns

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
            _path: '/contact/',
            _origin: '/contact/index.md',
            _target: '/contact/index.html',
            _uniqid: 'zkxv',
            _content: '<h2 id="page-samp ...'
        },
        {
            template: 'index',
            _path: '/',
            _origin: '/index.md',
            _target: '/index.html',
            _uniqid: 'r6qb',
            _content: ''
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
