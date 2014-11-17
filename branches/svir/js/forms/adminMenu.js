define("forms/adminMenu", [
	"jquery", "html", "knockout", 
	"errors",
	"forms/authorization", 
	"forms/users", 
	"forms/dataInput", 
	"forms/table_input", 
	"forms/colTable_input", 
	"forms/verification",
	"forms/myaccount"
], function(
	$, $H, ko, 
	errors,
	authorization,
	users,
	dataInput,
	tableInput,
	colTableInput,
	verification,
	myAccount
){

	function template(permissions){with($H){
		//var usr = authorization.user();
		var usr = $USER;
		return div(
			ul({"class":"menu"},
				usr.ticket && permissions.users?li({"data-bind":"click:showUsers"}, "Пользователи"):null,
				usr.ticket && permissions.verification?li({"data-bind":"click:verify"}, "Верификация данных"):null,
				usr.ticket?li({"data-bind":"click:tableInput"}, "Табличный ввод"):null,
				usr.ticket?li({"data-bind":"click:colTableInput"}, "Табличный ввод по колонкам"):null,
				usr.ticket?li({"data-bind":"click:dataInput"}, "Ввод данных"):null,
				usr.ticket?li({"data-bind":"click:myAccount"}, "Мои данные"):null,
				usr.ticket?li({"data-bind":"click:logoff"}, usr.name+" [Выйти]")
					:li({"data-bind":"click:authorization"}, "Авторизация")
			)
		);
	}}
	
	function Model(data, pnl){var _=this;
		$.extend(_, {
			showUsers: function(){
				users.view($("#out"));
			},
			verify: function(){
				verification.view();
			},
			authorization: function(){
				authorization.view($("#out"));
			},
			logoff: function(){
				authorization.logoff();
			},
			tableInput: function(){
				tableInput.view();
			},
			colTableInput: function(){
				colTableInput.view();
			},
			dataInput: function(){
				dataInput.view();
			},
			myAccount: function(){
				myAccount.view();
			}
		});
	}
	
	var panel;
	
	var form = {
		view: function(pnl){
			if(!pnl) pnl = $(".mainMenu");
			panel = pnl;
			$.post("ws/userPermissions.php", {ticket:$USER.ticket}, function(resp){
				var permissions = {organizations:[]};
				$.each(JSON.parse(resp), function(i, el){
					if(typeof(el)=="string") permissions[el]=true;
					else if(el.organization) permissions.organizations.push(el.organization);
				})
				//console.log(perms);
				pnl.html(template(permissions));
				ko.applyBindings(new Model(), pnl.find("div")[0]);
			});
		}
	};
	
	return form;
});