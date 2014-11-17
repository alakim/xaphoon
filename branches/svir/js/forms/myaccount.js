define("forms/myaccount", [
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
				h2("Мои учетные данные"),
				table({border:0},
					tr(th({align:"left"}, "Логин"), td(input({type:"text", readonly:true, "data-bind":"value:$login"}))),
					tr(th({align:"left"}, "Имя"), td(input({type:"text", "data-bind":"value:$name"}))),
					tr(th({align:"left"}, "Новый пароль"), td(input({type:"password", "data-bind":"value:$password1"}))),
					tr(th({align:"left"}, "Повторите пароль"), td(input({type:"password", "data-bind":"value:$password2"}))),
					tr(td({colspan:2, align:"center"}, 
						input({type:"button", value:"Сохранить", "data-bind":"click:save"}),
						img({src:"images/wait.gif", "class":"usrDlgWait", style:"display:none;"})
					))
				)
			);
		}}
	};
	
	function Model(){var _=this;
		$.extend(_,{
			$login: ko.observable($USER.login),
			$name: ko.observable($USER.name),
			$password1: ko.observable(""),
			$password2: ko.observable(""),
		});
		$.extend(_,{
			save: function(){
				var data = util.getModelData(_);
				if(data.password1!=data.password2){
					alert("Пароль не совпадает");
					return;
				}
				var res = {
					ticket: ticket,
					login: data.login,
					name: data.name
				};
				if(data.password1.length)
					res.password = data.password1;
				
				$(".usrDlgWait").show();
				$.post("ws/saveuser.php", res, function(resp){
					resp = JSON.parse(resp);
					$(".usrDlgWait").hide();
					//displayView();
				});
				
			}
		});
	}

	return {
		view: function(){
			pnl = $("#out");
			ticket = $USER.ticket;
			console.log($USER);
			
			pnl.html(templates.main());
			ko.applyBindings(new Model(), pnl.find("div")[0]);
		}
	};
});