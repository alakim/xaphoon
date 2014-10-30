define(["jquery", "html", "knockout", "db"], function($, $H, ko, db){

	var templates = {
		main: function(songs){with($H){
			return div(
				table({border:0},
					tr(
						td({width:250},
							ul(
								apply(songs, function(sng){
									return li({"class":"songLink", sID:sng.id}, sng.name)
								})
							)
						),
						td(div({id:"songPnl"}))
					)
				)
			);
		}},
		song: function(song){with($H){
			return div(
				h2(song.name),
				apply(song.xmlc, function(itm){
					return itm.xmlt=="record"?div(
							audio({controls:"controls"},
								source({src:itm.url, type:"audio/mp3"})
							),
							div("Date: ", itm.date),
							div(itm.description),
							div("Source: ", a({href:itm.url}, itm.url))
						)
						:null;
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