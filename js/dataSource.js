define("dataSource", ["jspath", "util"], function($JP, util){
	
	var tooLargeFileSize = 150000;
	


	return {
		load: function(file, arrMode, onload){
			var log = util.log("loading " + file + " ...");
			$.post("ws/load.php", {path:file}, function(resp){
				try{
					resp = $.parseJSON(resp);
				}
				catch(e){
					util.logError("Error parsing file "+file, log);
				}
				var res = resp.data;
				
				if(res==null || res.length==0) res = arrMode?"[]":"{}";
				
				try{
					var data = $.parseJSON(res);
				}
				catch(e){
					util.logError("Error parsing JSON data in "+file, log);
					onload();
					return;
				}
				onload(data);
				resp.size = "<span style='"+(resp.size>tooLargeFileSize?"color:red;":"")+"'>"+resp.size+" bytes</span>";
				util.log(resp.size+": OK", log);
			});

		},
		save: function(path, data, onsave){
			var log = util.log("saving "+path+" ...");
			var json = JSON.stringify(data);
			json = json.replace(/\s*\t+\s*/g, " ");
			$.post("ws/save.php", {path:path, data:json}, function(res){
				util.log("OK", log);
				onsave();
			});
		},
		backupData: function(onbackup){
			var backupUrl = "http://www.back.ru/sss/s.zip";
			$.post("ws/archive.php", {n:"dataBackup", d:"../data"}, function(res){
				res = $.parseJSON(res);
				if(res.error){
					alert(res.error);
					return;
				}
				onbackup(res.archive);
			});
		}
	};
});