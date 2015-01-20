requirejs.config({
    baseUrl: "js",
    paths: {
		jquery: "lib/jquery-1.11.0.min",
		html:"lib/html",
		jspath:"lib/jspath",
		knockout:"lib/knockout-3.1.0"
    },
	//urlArgs: "bust=" + (new Date()).getTime(),
	urlArgs: "bust=2.0",
	shim:{
		"html":{exports:"Html"},
		"jspath":{exports:"JsPath"}
	}
});

requirejs(["jquery", "html", "forms/mainMenu"], function($, $H, mainMenu) {
		mainMenu.view($(".mainMenu"));
});