define(["jquery", "html", "knockout", 
	"forms/authorization",
	"forms/songs"
], function($, $H, ko, 
	authorization,
	songs
){

	function template(){with($H){
		var usr = $USER;
		return div(
			ul({"class":"menu"},
				usr.ticket?li({"data-bind":"click:showSongs"}, "Песни"):null,
				usr.ticket?li({"data-bind":"click:logoff"}, usr.name+" [Выйти]")
					:li({"data-bind":"click:authorization"}, "Авторизация")
			)
		);
	}}
	
	function Model(data, pnl){var _=this;
		$.extend(_, {
			showSongs: function(){
				songs.view($(".mainPanel"));
			},
			authorization: function(){
				authorization.view($(".mainPanel"));
			},
			logoff: function(){
				authorization.logoff();
			}
		});
	}
	
	
	return {
		view: function(pnl){
			pnl = pnl || $(".mainMenu");
			pnl.html(template());
			ko.applyBindings(new Model(), pnl.find("div")[0]);
		}
	};
});