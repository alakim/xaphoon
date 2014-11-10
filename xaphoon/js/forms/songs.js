define(["jquery", "html", "knockout", "db", "forms/recordView"], function($, $H, ko, db, recordView){

	var templates = {
		main: function(songs){with($H){
			return div(
				table({border:0},
					tr(
						td({width:250, valign:"top"},
							ul(
								apply(songs, function(sng){
									return li({"class":"songLink", sID:sng.id}, sng.name)
								})
							)
						),
						td({valign:"top"}, div({id:"songPnl"}))
					)
				)
			);
		}},
		song: function(song){with($H){
			var records = db.getRecords(song.id);
			return div(
				h2(song.name),
				h3("Записи"),
				apply(records, function(itm){
					return div(
						h4(itm.session.date, " ", itm.session.title),
						recordView.template(itm.record)
					);
				})
			);
		}}
	};
	
	
	function viewSong(sID){
		var song = db.getSong(sID);
		$("#songPnl").html(templates.song(song));
	}
	
	return {
		view: function(pnl){
			pnl = pnl || $(".mainPanel");
			var songs = db.getSongs();
			pnl.html(templates.main(songs));
			pnl.find(".songLink").css({cursor:"pointer"}).click(function(){
				var sID = $(this).attr("sID");
				viewSong(sID);
			});
		}
	};
});