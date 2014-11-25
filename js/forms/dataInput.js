define("forms/dataInput", [
	"jquery", "html", "knockout", "db", 
	"util", "validation", "errors",
	"mapping",
	"controls/persondialog"
], function(
	$, $H, ko, db, 
	util, validation, errors,
	mapping,
	personDialog
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
						div({"class":"orgDialog", style:"display:none;"},
							table({border:0, cellpadding:3, cellspacing:0},
								tr(td("Наименование"),td(
									input({type:"text", "data-bind":"value:$name"}),
									util.validMsg("$name")
								)),
								tr(td("Рабочий телефон"),td(
									input({type:"text", "data-bind":"value:$workPhone"}),
									util.validMsg("$workPhone")
								)),
								tr(td("Факс"),td(
									input({type:"text", "data-bind":"value:$fax"}),
									util.validMsg("$fax")
								)),
								tr(td("Электронный адрес"),td(
									input({type:"text", "data-bind":"value:$email"}),
									util.validMsg("$email")
								)),
								tr(td("Почтовый адрес"),td(
									input({type:"text", "data-bind":"value:$address"}),
									util.validMsg("$address")
								))
							),
							input({type:"button", "data-bind":"click:submitData", value:"Сохранить"}),
							span({"class":"savingIcon", style:"display:none"}, img({src:"images/wait.gif", style:"margin:0 0 0 10px;"}))
						)
					)
				))
			):null;
		}}
	};
	
	var pnl, ticket;
	
	function viewEditPanel(){
		var orgID = $("#out .selOrg").val();
		$("#out .editPnl").html(templates.editPanel(orgID));
		
		var orgModel = new OrganizationModel();
		$("#out .editPnl .orgEditLink").click(function(){
			orgModel.openDialog(db.getOrganization(orgID));
		});
		
		$("#out .editPnl .personEditLink").click(function(){
			var prsID = $(this).attr("prsID");
			$("#out .editPnl .personDialog").personDialog(prsID, function(){
				db.refresh(function(){
					viewEditPanel();
				});
			});
		});
		$("#out .btAddPerson").click(function(){
			$("#out .editPnl .personDialog").personDialog(null, function(){
				db.refresh(function(){
					viewEditPanel();
				});
			});
		});

		
		ko.applyBindings(orgModel, pnl.find(".orgDialog")[0]);
	}
	

	function OrganizationModel(){var _=this;
		$.extend(_, {
			id:ko.observable(),
			$name:ko.observable("").extend({required:"Укажите название организации"}),
			$workPhone:ko.observable(""), //.extend({required:"Укажите рабочий телефон"}),
			$fax:ko.observable(""), //.extend({required:"Укажите факс"}),
			$email:ko.observable(""),//.extend({requiredEMail:"Укажите электронный адрес"}),
			$address:ko.observable("")//.extend({required:"Укажите почтовый адрес"})
		});
		$.extend(_, {
			openDialog: function(org){var _=this;
				_.id(org?org.id:null);
				for(var k in _){
					if(k.slice(0,1)=="$"){
						var val = org?org[mapping.getJsonAttr(k)]:"";
						_[k](val);
					}
				}
				$(".personDialog").hide();
				$(".orgDialog").show();
			},
			submitData: function(){var _=this;
				if(!validation.validate(_)) return;
				var res = {id:_.id(), ticket:ticket};
				res.orgID = $("#out .selOrg").val();
				for(var k in _){
					if(k.slice(0,1)=="$"){
						var attNm = mapping.getJsonAttr(k);
						var val = _[k]();
						res[attNm] = val==null?"":val;
					}
				}
				$("#out .savingIcon").show();
				$.post("ws/saveOrg.php", res, function(resp){resp = JSON.parse(resp);
					$("#out .savingIcon").hide();
					if(resp.error){
						alert(errors.code[resp.error]);
						return;
					}
					$(".orgDialog").hide();
					db.refresh(function(){
						viewEditPanel();
					});
				});
			}

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