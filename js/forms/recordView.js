define(["jquery", "html", "db"], function($, $H, db){
	return {
		template: function(record, viewTitle){with($H){
			return markup(
				viewTitle?db.getSong(record.song).name:null,
				div({style:"margin-left:20px;"},
					record.online=="true"?audio({controls:"controls"},
						source({src:record.url, type:"audio/mp3"})
					):null,
					div(record.description),
					div(a({href:record.url}, "Download"))
				)
			);
		}}
	};
});