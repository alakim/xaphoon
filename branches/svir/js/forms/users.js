define("forms/users", ["jquery", "html", "knockout", "util", "validation", "errors"], function($, $H, ko, util, validation, errors){

	function template(data){with($H){
		//console.log(data);
		return div(
			h2("Пользователи"),
			table({border:1, cellpadding:3, cellspacing:0},
				tr(th("Логин"), th("Имя")),
				apply(data.users, function(usr){
					return usr?tr(
						td(usr.login),
						td(usr.name)
					):null;
				})
			)
		);
	}}
	
	var pnl, ticket;
	
	return {
		view: function(){
			pnl = $("#out");
			ticket = $USER.ticket;
			
			$.post("ws/userPermissions.php", {ticket:ticket}, function(resp){
				resp = JSON.parse(resp);
				if(resp.indexOf("users")>=0){
					$.post("ws/userlist.php", {ticket:ticket}, function(resp){
						resp = JSON.parse(resp);
						if(resp.error)
							alert(errors.code[resp.error]);
						else{
							pnl.html(template(resp));
						}
					});
				}
				else{
					pnl.html("Доступ запрещен");
				}
			});
			
		}
	};
});