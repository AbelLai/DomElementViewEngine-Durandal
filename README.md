DomElementViewEngine-Durandal
=============================

DurandalJS是一个不错的用于构建SPA的框架，但它原本的ViewEngine是基于独立分开的view文件的，也就是呈现一个View时是需要通过HTTP从获取回来才展示的（比如从服务器获取一个html文件，该文件包含相应View的html内容）。而我则想在直接在首页文件里面加载出所有的View模板，然后ViewEngine只要找到（直接通过JS获取一个Dom节点的方式）相应的View模板即可。

所以，我根据原来ViewEngine进行了修改出了一个[DomElementViewEngine](https://github.com/AbelLai/DomElementViewEngine-Durandal/blob/master/public/lib/durandal/js/domElementViewEngine.js)。

引用方式（直接替换掉原来的ViewEngine即可）：
```
require.config({
	paths: {
		'durandal/viewEngine': '../lib/durandal/js/domElementViewEngine'
	},
});

```

***注意***
定义View的id需要与ViewModel的module id一致，如：
*定义View*
```
<script type="text/x-jquery-tmpl" id="shell">
	<div>
		<nav class="navbar navbar-default navbar-fixed-top" role="navigation">
			<div class="navbar-header">
				<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
					<span class="sr-only">Toggle Navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
				</button>
				<a class="navbar-brand" href="#">
					<i class="fa fa-home"></i>
					<span>Durandal</span>
				</a>
			</div>
			<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
				<ul class="nav navbar-nav" data-bind="foreach: router.navigationModel">
					<li data-bind="css: { active: isActive }">
						<a data-bind="attr: { href: hash }, html: title"></a>
					</li>
				</ul>
				<ul class="nav navbar-nav navbar-right">
					<li class="loader" data-bind="css: { active: router.isNavigating }">
						<i class="fa fa-spinner fa-spin fa-2x"></i>
					</li>
				</ul>

				<form class="navbar-form navbar-right" role="search" data-bind="submit: search">
					<div class="form-group">
						<input type="text" class="form-control" placeholder="Search" />
					</div>
				</form>
			</div>
		</nav>
		<div class="page-host" data-bind="router: { transition: 'entrance' }">
		</div>
	</div>
</script>

```

*定义View Model*
```
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

```

如何start，请看如下：
```
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

```

***最后请注意***
这是一个基于ExpressJS的demo，所以运行前请确保是否已经安装了Node.js以及相关模块。