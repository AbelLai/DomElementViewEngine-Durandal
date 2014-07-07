require.config({
	paths: {
		'text': '../lib/require/text',
		'durandal': '../lib/durandal/js',
		'plugins': '../lib/durandal/js/plugins',
		'transitions': '../lib/durandal/js/transitions',
		'knockout': '../lib/knockout/knockout-3.1.0',
		'jquery': '../lib/jquery/jquery-1.9.1',
		'durandal/viewEngine': '../lib/durandal/js/domElementViewEngine',
		'bootstrap': '../lib/bootstrap/js/bootstrap'
	},

	shim: {
		'bootstrap': {
			deps: ['jquery'],
			exports: 'jQuery'
		}
	}
});

define('welcom', ['durandal/app', 'knockout'], function(app, ko) {
	return {
		displayName: ko.observable('Welcome to the Durandal Starter Kit!'),

		description: ko.observable('Durandal is a cross-device, cross-platform client framework written in JavaScript and designed to make Single Page Applications (SPAs) easy to create and maintain.'),

		features: ko.observableArray([
            'Clean MV* Architecture',
            'JS & HTML Modularity',
            'Simple App Lifecycle',
            'Eventing, Modals, Message Boxes, etc.',
            'Navigation & Screen State Management',
            'Consistent Async Programming w/ Promises',
            'App Bundling and Optimization',
            'Use any Backend Technology',
            'Built on top of jQuery, Knockout & RequireJS',
            'Integrates with other libraries such as SammyJS & Bootstrap',
            'Make jQuery & Bootstrap widgets templatable and bindable (or build your own widgets).'
        ])
	};
});

define('flickr', ['plugins/http', 'durandal/app', 'knockout'], function(http, app, ko) {
	var url = 'http://api.flickr.com/services/feeds/photos_public.gne';

	var qs = {
		tags : 'mount ranier',
		tagmode: 'any',
		format: 'json'
	};

	return {
		displayName: 'Flickr',

		images: ko.observableArray([]),

		activate: function() {
			var that = this;

			if(this.images().length > 0) {
				return;
			}

			return http.jsonp(url, qs, 'jsoncallback').then(function(res) {
				that.images(res.items);
			});
		},

		select: function(item) {
			item.viewUrl = 'details';

			app.showDialog(item);
		},

		canDeactivate: function() {
			return app.showMessage('Are you sure you want to leave this page?', 'Navigation', ['Yes', 'No']);
		}
	};
});

define('shell', ['durandal/app', 'plugins/router', 'knockout', 'jquery'], function(app, router, ko, $) {
	return {
		router: router,

		search: function() {
			app.showMessage('Search not yet implemented...');
		},

		activate: function() {
			router.map([
				{ route: '', title: 'Welcom', moduleId: 'welcom', nav: true },
				{ route: 'flickr', title: 'Flickr', moduleId: 'flickr', nav: true }
			]).buildNavigationModel();

			return router.activate();
		}
	};
});

define(function (require) {
	var app = require('durandal/app'),
		system = require('durandal/system');

	system.debug(true);

	app.title = 'Durandal Starter Kit';
	app.configurePlugins({
		router: true,
		dialog: true
	});

	app.start().then(function() {
		//viewLocator.useConvention();
		
		var shell = require('shell');
		app.setRoot(shell, 'entrance')
	});
});