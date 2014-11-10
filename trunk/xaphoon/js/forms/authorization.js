define(["jquery", "html", "knockout", "util", "validation", "errors"], function($, $H, ko, util, validation, errors){

	function template(){with($H){
		return div({"class":"dialog", style:"width:300px;"},
			h2("Авторизация пользователя"),
			table({border:0, cellpadding:3, cellspacing:0},
				tr(
					th("Логин"),
					td(
						input({type:"text", style:"width:200px;", "data-bind":"value:$login"}),
						util.validMsg("$login")
					)
				),
				tr(
					th("Пароль"),
					td(
						input({type:"password", style:"width:200px;", "data-bind":"value:$password"}),
						util.validMsg("$password")
					)
				),
				tr(
					td({colspan:2, align:"center"},
						input({type:"button", value:"Вход", "data-bind":"click:logon"})
					)
				)
			)
		);
	}}
	
	function Model(data, pnl){var _=this;
		$.extend(_,{
			$login: ko.observable("").extend({required:"Укажите логин"}),
			$password: ko.observable("").extend({required:"Введите пароль"})
		});
		$.extend(_,{
			logon: function(){
				if(!validation.validate(_)) return;
				var d = util.getModelData(this);
				
				$.post("ws/logon.php", {login:d.login, password:d.password}, function(resp){
					resp = JSON.parse(resp);
					if(resp.error)
						alert(errors.code[resp.error]);
					else{
						authorizedUser.ticket = resp.ticket;
						authorizedUser.name = resp.name;
						$USER = authorizedUser;
						$(".mainPanel").html("");
						require("forms/mainMenu").view();
					}
				});
				
				
				
			}
		});
	}
	
	var authorizedUser = {};
	var panel;
	
	return {
		view: function(pnl){pnl=$(pnl);
			panel = pnl;
			pnl.html(template());
			ko.applyBindings(new Model(), pnl.find("div")[0]);
		},
		user: function(){
			return authorizedUser;
		},
		logoff: function(){
			$.post("ws/logoff.php", {ticket:authorizedUser.ticket}, function(resp){
				resp = JSON.parse(resp);
				if(resp.error)
					alert(errors.code[resp.error]);
				else{
					$USER = authorizedUser = {};
					require("forms/mainMenu").view();
					$(".mainPanel").html("");
				}
			});
		}
	};
});