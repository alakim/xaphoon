﻿define(["jquery", "html", "knockout", "db", "util", "validation", "errors"], function($, $H, ko, db, util, validation, errors){

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
				div({"class":"editPnl"})
			);
		}},
		editPanel: function(orgID){with($H){
			var org = db.getOrganization(orgID);
			return org?div(
				h2(org.name),
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
					input({type:"button", "data-bind":"click:submitData", value:"Ввод"}),
					span({"class":"savingIcon", style:"display:none"}, "Идет сохранение...")
				)
			):null;
		}}
	};
	
	var pnl, ticket;
	
	function viewEditPanel(){
		var orgID = $("#out .selOrg").val();
		$("#out .editPnl").html(templates.editPanel(orgID));
		var model = new PersonModel();
		$("#out .editPnl .personEditLink").click(function(){
			var prsID = $(this).attr("prsID");
			var person = db.getPerson(prsID);
			model.openDialog(person);
			$(".personDialog").show();
		});
		
		ko.applyBindings(model, pnl.find(".personDialog")[0]);
	}
	
	var mapping = (function(){
		var map2Json = {
			$fio:"fio",
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

	function PersonModel(){var _=this;
		$.extend(_, {
			id:null,
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
			openDialog: function(person){var _=this;
				_.id = person.id;
				for(var k in _){
					if(k.slice(0,1)=="$"){
						var val = person?person[mapping.getJsonAttr(k)]:"";
						_[k](val);
					}
				}
			},
			submitData: function(){var _=this;
				if(!validation.validate(_)) return;
				var res = {id:_.id, ticket:ticket};
				for(var k in _){
					if(k.slice(0,1)=="$"){
						var attNm = mapping.getJsonAttr(k);
						var val = _[k]();
						res[attNm] = val==null?"":val;
					}
				}
				//console.log(res);
				$("#out .savingIcon").show();
				$.post("ws/savePerson.php", res, function(resp){resp = JSON.parse(resp);
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
			pnl.html(templates.main());

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