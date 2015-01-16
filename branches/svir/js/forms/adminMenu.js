﻿define("forms/adminMenu", [
	"jquery", "html", "knockout", 
	"errors",
	"db",
	"forms/authorization", 
	"forms/users", 
	"forms/dataInput", 
	"forms/table_input", 
	"forms/colTable_input", 
	"forms/verification",
	"forms/myaccount",
	"forms/orgedit",
	"forms/structedit",
	"forms/structColTable_input"
], function(
	$, $H, ko, 
	errors,
	db,
	authorization,
	users,
	dataInput,
	tableInput,
	colTableInput,
	verification,
	myAccount,
	orgEditor,
	structEditor,
	structColTableInput
){

	function template(permissions){with($H){
		var usr = $USER;
		return div(
			ul({"class":"menu"},
				usr.ticket && permissions["@users"]?li({"data-bind":"click:showUsers"}, "Пользователи"):null,
				usr.ticket && permissions["@verification"]?li({"data-bind":"click:verify"}, "Верификация данных"):null,
				//usr.ticket?li({"data-bind":"click:tableInput"}, "Табличный ввод"):null,
				usr.ticket?li({"data-bind":"click:clearCache"}, "Очистить кэш"):null,
				usr.ticket?li({"data-bind":"click:structColTableInput"}, "Ввод структуры"):null,
				usr.ticket?li({"data-bind":"click:colTableInput"}, "Табличный ввод по колонкам"):null,
				usr.ticket?li({"data-bind":"click:viewOrgEditor"}, "Ввод организаций"):null,
				usr.ticket?li({"data-bind":"click:dataInput"}, "Ввод данных"):null,
				usr.ticket?li({"data-bind":"click:editStructure"}, "Структура"):null,
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
			clearCache: function(){
				$("#out").html($H.img({src:"images/wait.gif"}));
				$.post("ws/clearCache.php", {ticket:$USER.ticket}, function(resp){
					resp = JSON.parse(resp);
					db.refresh(function(){
						$("#out").html($H.div(resp.success?"Кэш очищен":resp.error?resp.error:""));
					});
				});
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
			structColTableInput: function(){
				structColTableInput.view();
			},
			dataInput: function(){
				dataInput.view();
			},
			editStructure: function(){
				structEditor.view();
			},
			myAccount: function(){
				myAccount.view();
			},
			viewOrgEditor:function(){
				orgEditor.view();
			}
		});
	}
	
	var panel;
	
	var form = {
		view: function(pnl){
			if(!pnl) pnl = $(".mainMenu");
			panel = pnl;
			$.post("ws/userPermissions.php", {ticket:$USER.ticket}, function(resp){
				pnl.html(template(JSON.parse(resp)));
				ko.applyBindings(new Model(), pnl.find("div")[0]);
			});
		}
	};
	
	return form;
});