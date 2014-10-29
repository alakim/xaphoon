define(["jquery", "html", "knockout", "db", "util", "validation", "errors"], function($, $H, ko, db, util, validation, errors){

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
				div({"class":"editPnl"}),
				div({style:"clear:both;"}),
				div(input({type:"button", "class":"btAddPerson", value:"Добавить сотрудника", style:"margin:8px 0 0 0"}))
			);
		}},
		editPanel: function(orgID){with($H){
			var org = db.getOrganization(orgID);
			return org?div(
				h2(org.name),
				p({"class":"link orgEditLink"}, "Редактировать данные организации"),
				h3("Сотрудники"),
				div({"class":"personList", style:"float:left;"},
					apply(org.xmlchildren, function(el){
						return el.xmltype=="person"?div({"class":"link personEditLink", prsID:el.id}, el.fio):null;
					})
				),
				div({"class":"personDialog", style:"margin-left:300px; display:none;"},
					table({border:0, cellpadding:3, cellspacing:0},
						tr(td("ФИО"),td(
							input({type:"text", "data-bind":"value:$fio"}),
							util.validMsg("$fio")
						)),
						tr(td("Должность"),td(
							input({type:"text", "data-bind":"value:$post"}),
							util.validMsg("$post")
						)),
						tr(td("Внутренний телефон"),td(
							input({type:"text", "data-bind":"value:$inPhone"}),
							util.validMsg("$inPhone")
						)),
						tr(td("Рабочий телефон"),td(
							input({type:"text", "data-bind":"value:$workPhone"}),
							util.validMsg("$workPhone")
						)),
						tr(td("Факс"),td(
							input({type:"text", "data-bind":"value:$fax"}),
							util.validMsg("$fax")
						)),
						tr(td("Мобильный телефон"),td(
							input({type:"text", "data-bind":"value:$mobPhone"}),
							util.validMsg("$mobPhone")
						)),
						tr(td("Электронный адрес"),td(
							input({type:"text", "data-bind":"value:$email"}),
							util.validMsg("$email")
						)),
						tr(td("Номер комнаты"),td(
							input({type:"text", "data-bind":"value:$roomNr"}),
							util.validMsg("$roomNr")
						)),
						tr(td("Почтовый адрес"),td(
							input({type:"text", "data-bind":"value:$address"}),
							util.validMsg("$address")
						))
					),
					input({type:"button", "data-bind":"click:submitData", value:"Сохранить"}),
					input({type:"button", "data-bind":"click:deletePerson,visible:existingRow", value:"Удалить", style:"margin:0 0 0 10px;"}),
					span({"class":"savingIcon", style:"display:none"}, img({src:"images/wait.gif", style:"margin:0 0 0 10px;"}))
				),
				div({"class":"orgDialog", style:"margin-left:300px; display:none;"},
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
			):null;
		}}
	};
	
	var pnl, ticket;
	
	function viewEditPanel(){
		var orgID = $("#out .selOrg").val();
		$("#out .editPnl").html(templates.editPanel(orgID));
		var persModel = new PersonModel();
		var orgModel = new OrganizationModel();
		$("#out .editPnl .orgEditLink").click(function(){
			orgModel.openDialog(db.getOrganization(orgID));
		});
		$("#out .editPnl .personEditLink").click(function(){
			var prsID = $(this).attr("prsID");
			persModel.openDialog(db.getPerson(prsID));
		});
		$("#out .btAddPerson").click(function(){
			persModel.openDialog();
		});

		
		ko.applyBindings(persModel, pnl.find(".personDialog")[0]);
		ko.applyBindings(orgModel, pnl.find(".orgDialog")[0]);
	}
	
	var mapping = (function(){
		var map2Json = {
			$fio:"fio",
			$name:"name",
			$post:"dolzh",
			$inPhone:"vnutTel",
			$workPhone:"rabTel",
			$fax:"faks",
			$mobPhone:"mobTel",
			$email:"elekAdr",
			$roomNr:"numKomn",
			$address:"potchtAdr",
		};
		
		map2field = {};
		for(var k in map2Json){var v=map2Json[k]; map2field[v]=k;}
		
		return {
			getField: function(attrNm){return map2field[attNm];},
			getJsonAttr: function(fieldNm){return map2Json[fieldNm];}
		};
	})();

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
	
	function PersonModel(){var _=this;
		$.extend(_, {
			id:ko.observable(),
			$fio:ko.observable("").extend({required:"Укажите ФИО"}),
			$post:ko.observable("").extend({required:"Укажите должность"}),
			$inPhone:ko.observable(""), //.extend({required:"Укажите внутренний телефон"}),
			$workPhone:ko.observable(""), //.extend({required:"Укажите рабочий телефон"}),
			$fax:ko.observable(""), //.extend({required:"Укажите факс"}),
			$mobPhone:ko.observable(""), //.extend({required:"Укажите мобильный телефон"}),
			$email:ko.observable("").extend({requiredEMail:"Укажите электронный адрес"}),
			$roomNr:ko.observable("").extend({required:"Укажите номер комнаты"}),
			$address:ko.observable("")//.extend({required:"Укажите почтовый адрес"})
		});
		
		$.extend(_, {
			existingRow: ko.computed(function(){return _.id()!=null;}, _),
			openDialog: function(person){var _=this;
				_.id(person?person.id:null);
				for(var k in _){
					if(k.slice(0,1)=="$"){
						var val = person?person[mapping.getJsonAttr(k)]:"";
						_[k](val);
					}
				}
				$(".orgDialog").hide();
				$(".personDialog").show();
			},
			deletePerson:function(){var _=this;
				if(!confirm("Удалить эту запись?")) return;
				$.post("ws/delPerson.php", {id:_.id(), ticket:ticket}, function(resp){resp = JSON.parse(resp);
					if(resp.error){
						alert(errors.code[resp.error]);
						return;
					}
					$(".personDialog").hide();
					db.refresh(function(){
						viewEditPanel();
					});
				});
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
				$.post(_.id()?"ws/savePerson.php":"ws/addPerson.php", res, function(resp){resp = JSON.parse(resp);
					$("#out .savingIcon").hide();
					if(resp.error){
						alert(errors.code[resp.error]);
						return;
					}
					$(".personDialog").hide();
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