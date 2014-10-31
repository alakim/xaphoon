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
				$STATE.form = "songs";
				songs.view($(".mainPanel"));
			},
			showSessions: function(){
				$STATE.form = "sessions";
				sessions.view($(".mainPanel"));
			},
			edit: function(){
				$STATE.editMode = true;
				switch($STATE.form){
					case "songs": songs.view($(".mainPanel"));break;
					case "sessions": sessions.view($(".mainPanel"));break;
					default: break;
				}
			},
			authorization: function(){
				authorization.view($(".mainPanel"));
			},
			logoff: function(){
				$STATE.form = null;
				$STATE.editMode = false;
				
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