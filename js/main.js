requirejs.config({
    baseUrl: "js",
    paths: {
		jquery: "lib/jquery-1.11.0.min",
		html:"lib/html",
		jspath:"lib/jspath",
		knockout:"lib/knockout-3.1.0",
		common:"forms/common"
    },
	urlArgs: "bust=" + (new Date()).getTime(),
	shim:{
		"html":{exports:"Html"},
		"jspath":{exports:"JsPath"}
	}
});

requirejs(["jquery", "html", "db", "forms/mainMenu", "forms/songs"], function($, $H, db, mainMenu, songs) {
	db.init(function(){
		mainMenu.view($(".mainMenu"));
		songs.view($(".mainPanel"));
	});
});