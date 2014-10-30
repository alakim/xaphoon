define(["jquery","jspath", "dataSource", "util"], function($, $JP, dSrc, util){
	var localDB = {};
	var changes = {};
	
	function indexDB(){
		localDB.records = {};
		function addRecord(rec, session){
			var sID = rec.song;
			if(!localDB.records[sID]) localDB.records[sID] = [];
			localDB.records[sID].push({
				record: rec,
				session: session
			});
		}
		$.each(localDB.data.sessions, function(i, sess){
			$.each(sess.xmlc, function(i, el){
				if(el.xmlt=="record") addRecord(el, sess);
			});
		});
		
		for(var k in localDB.records){
			var coll = localDB.records[k];
			localDB.records[k] = coll.sort(function(r1, r2){
				return r1.session.date==r2.session.date?0
					:r1.session.date<r2.session.date?1
					:-1;
			});
		}
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
		getSong: function(id){
			return localDB.data.songs[id];
		},
		getSongs: function(){
			return localDB.data.songs;
		},
		getRecords: function(songID){
			return localDB.records[songID];
		}
	};
});