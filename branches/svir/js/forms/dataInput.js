define("forms/dataInput", [
	"jquery", "html", "knockout", "db", 
	"util", "validation", "errors",
	"mapping",
	"controls/persondialog",
	"controls/orgdialog"
], function(
	$, $H, ko, db, 
	util, validation, errors,
	mapping,
	personDialog,
	orgDialog
){

	var templates = {
		main: function(permissions){with($H){
			return div(
				div(
					"Выберите организацию ",
					select({"class":"selOrg"},
						apply(permissions, function(prm){
							return prm.organization?option({value:prm.organization}, db.getOrganization(prm.organization).name):null;
						})
					)
				),
				div(input({type:"button", "class":"btAddPerson", value:"Добавить сотрудника", style:"margin:8px 0 0 0"})),
				div({"class":"editPnl"})
			);
		}},
		editPanel: function(orgID){with($H){
			var org = db.getOrganization(orgID);
			return org?div(
				table({border:0, cellpadding:3, cellspacing:0}, tr(
					td({valign:"top"},
						h2(org.name),
						p({"class":"link orgEditLink"}, "Редактировать данные организации"),
						h3("Сотрудники"),
						div({"class":"personList"},
							apply(org.xmlchildren, function(el){
								//console.log(el);
								return el.xmltype=="person"?div({"class":"link personEditLink", prsID:el.id}, el.dolzh, "  ", el.fio):null;
							})
						)
					),
					td({valign:"top"},
						div({"class":"personDialog"}),
						div({"class":"orgDialog"})
					)
				))
			):null;
		}}
	};
	
	var pnl, ticket;
	
	function refreshAll(){
		db.refresh(function(){
			viewEditPanel();
		});
	}
	
	function viewEditPanel(){
		var orgID = $("#out .selOrg").val();
		$("#out .editPnl").html(templates.editPanel(orgID));
		
		$("#out .editPnl .orgEditLink").click(function(){
			$("#out .editPnl .orgDialog").orgDialog(orgID, refreshAll);
		});
		$("#out .editPnl .personEditLink").click(function(){
			var prsID = $(this).attr("prsID");
			$("#out .editPnl .personDialog").personDialog(prsID, refreshAll);
		});
		$("#out .btAddPerson").click(function(){
			$("#out .editPnl .personDialog").personDialog(null, refreshAll);
		});
	}
	
	return {
		view: function(){
			pnl = $("#out");
			ticket = $USER.ticket;

			db.init(function(){
				$.post("ws/userPermissions.php", {ticket:ticket}, function(resp){resp = JSON.parse(resp);
					pnl.html(templates.main(resp));
					viewEditPanel();
					$("#out .selOrg").change(function(){
						$("#out .editPnl").html("");
						viewEditPanel();
					});
				});
			});
		}
	};
});