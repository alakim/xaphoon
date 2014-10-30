define(["jquery", "html", "knockout", 
	"forms/authorization",
	"forms/songs",
	"forms/sessions"
], function($, $H, ko, 
	authorization,
	songs,
	sessions
){

	function template(permissions){with($H){
		var usr = $USER;
		return div(
			ul({"class":"menu"},
				usr.ticket?li({"data-bind":"click:showSongs"}, "Песни"):null,
				usr.ticket?li({"data-bind":"click:showSessions"}, "Сессии"):null,
				usr.ticket&&permissions.edit?li({"data-bind":"click:edit"}, "Редактировать"):null,
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
			showSessions: function(){
				sessions.view($(".mainPanel"));
			},
			edit: function(){
				alert("Edit Mode!");
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
			
			
			$.post("ws/userPermissions.php", {ticket:$USER.ticket}, function(resp){
				var permissions = {};
				$.each(JSON.parse(resp), function(i, el){
					if(typeof(el)=="string") permissions[el]=true;
				})
				pnl.html(template(permissions));
				ko.applyBindings(new Model(), pnl.find("div")[0]);
			});

			
		}
	};
});