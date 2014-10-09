define(["jspath", "dataSource", "util"], function($JP, dSrc, util){
	var localDB = {};
	var changes = {};
	
	
	
	return {
		init: function(callback){
			dSrc.load("songs.json", true, function(data){
				localDB.songs = data;
				callback();
			});
		},
		getSongs: function(){
			return localDB.songs;
		}
	};
});