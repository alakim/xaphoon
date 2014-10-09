define(["jquery", "html", "knockout", "db"], function($, $H, ko, db){
	function template(songs){with($H){
		return div(
			ul(
				apply(songs, function(sng){
					return li(sng.name)
				})
			)
		);
	}}
	
	
	return {
		view: function(pnl){
			var songs = db.getSongs();
			pnl.html(template(songs));
		}
	};
});