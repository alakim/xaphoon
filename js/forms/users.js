define("forms/users", [
	"jquery", "html", "knockout", 
	"util", "validation", "errors",
	"db"
], function(
	$, $H, ko, 
	util, validation, errors,
	db
){

	var templates = {
		main: function(){with($H){
			return div(
				h2("Пользователи"),
				table({border:0}, tr(
					td({width:"35%", valign:"top"},
						table({border:1, cellpadding:3, cellspacing:0},
							tr(th("Логин"), th("Имя")),
							apply(users, function(usr){
								return usr?tr({"class":"rUser", uID:usr.login}, 
									td(usr.login),
									td(usr.name)
								):null;
							})
						)
					),
					td({"class":"pnlEdit", valign:"top"}
						
					)
				))
			);
		}},
		userDialog: function(newMode){with($H){
			var attrLogin = {type:"text", style:"width:200px;", "data-bind":"value:$login"};
			if(!newMode) attrLogin.readonly = true;
			var orgList = db.getAllOrganizations();
			return div(
				table({border:0},
					tr(th("Логин"), td(input(attrLogin)),
						util.validMsg("$login")),
					tr(th("Имя"), td(input({type:"text", style:"width:500px;", "data-bind":"value:$name"}))),
					// tr(th("Организация"), td(
					// 	select({"data-bind":"value:$organization"},
					// 		option({value:"0"}, "----"),
					// 		apply(db.getAllOrganizations(), function(org){
					// 			return option({value:org.id}, org.name);
					// 		})
					// 	)
					// )),
					tr(th("Доступ"), td({"class":"pnlAccess"})),
					tr(th("Новый пароль"), td(input({type:"password", style:"width:500px;", "data-bind":"value:$password1"}))),
					tr(th("Повторите пароль"), td(input({type:"password", style:"width:500px;", "data-bind":"value:$password2"}),
						util.validMsg("$password2"))),
					tr(td({colspan:2, align:"center"}, 
						input({type:"button", value:"Сохранить", "data-bind":"click:save"}),
						img({src:"images/wait.gif", "class":"usrDlgWait", style:"display:none;"})
					))
				)
			);
		}},
		accessList: function(userData){with($H){
			return div(
				apply(userData.access, function(v, k){
					return span(k, ":", v?"+":"-", " ");
				})
			);
		}}
	};
	
	var pnl, ticket;
	var users;
	
	function buildUsersDB(data){
		users = data;
		users.index = {};
		for(var i=0; i<users.length; i++){
			var user = users[i];
			if(user) users.index[user.login] = user;
		}
	}
	
	function createUser(){
		var pnl = $(".pnlEdit");
		pnl.html(templates.userDialog(true));
		ko.applyBindings(new UserModel(), pnl.find("div")[0]);
	}
	
	function selectUser(id){
		var pnl = $(".pnlEdit");
		pnl.html(templates.userDialog());
		var userData = users.index[id];
		//console.log(userData);
		ko.applyBindings(new UserModel(userData), pnl.find("div")[0]);
		pnl.find(".pnlAccess").html(templates.accessList(userData));
	}
	
	function UserModel(user){var _=this;
		$.extend(_,{
			$login: ko.observable(user.login),
			$name: user.name,
			$password1: ko.observable(""),
			$password2: ko.observable(""),
			$organization: ko.observable(user.organization)
		});
		if(!user) _.$login.extend({required:"Укажите логин", uniqueID:{coll:users.index}});
		
		$.extend(_,{
			save:function(){
				var data = util.getModelData(_);
				if(data.password2!=data.password1){
					alert("Пароли не совпадают");
					return;
				}
				var res = {
					ticket: ticket,
					login: data.login,
					name: data.name,
					organization: data.organization
				};
				if(data.password1) 
					res.password = data.password1;
				$(".usrDlgWait").show();
				$.post("ws/saveuser.php", res, function(resp){
					resp = JSON.parse(resp);
					$(".usrDlgWait").hide();
					displayView();
				});
			}
		});
	}
	
	function displayView(){
		$.post("ws/userlist.php", {ticket:$USER.ticket, fullMode:true}, function(resp){
			resp = JSON.parse(resp);
			if(resp.error)
				alert(errors.code[resp.error]);
			else{
				buildUsersDB(resp.users);
				pnl.html(templates.main());
				pnl.find(".rUser").css({cursor:"pointer"}).click(function(){selectUser($(this).attr("uID"));});
			}
		});
	}
	
	return {
		view: function(){
			pnl = $("#out");
			ticket = $USER.ticket;
			
			pnl.html($H.img({src:"images/wait.gif"}));
			
			$.post("ws/userPermissions.php", {ticket:ticket}, function(resp){
				resp = JSON.parse(resp);
				if(resp.indexOf("users")>=0){
					db.init(function(){
						displayView();
					});
				}
				else{
					pnl.html("Доступ запрещен");
				}
			});
			
		}
	};
});