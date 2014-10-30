define(["jspath", "dataSource", "util"], function($JP, dSrc, util){
	var localDB = {};
	var changes = {};
	
	function indexDB(){
	}
	
	return {
		init: function(callback){
			if(localDB.data){
				callback();
				return;
			}
			$.post("ws/db.php", {}, function(resp){
				var data = JSON.parse(resp);
				localDB.data = data;
				indexDB();
				callback();
			});
		},
		refresh: function(callback){
			localDB.data = null;
			this.init(callback);
		},
		getSongs: function(){
			return localDB.data.songs;
		}
	};
});