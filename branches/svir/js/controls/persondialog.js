define("controls/persondialog", [
	"jquery", "html", "knockout", 
	"util", "mapping", "db", "validation"
], function(
	$, $H, ko, 
	util, mapping, db,
	validation
) {
	
	$.fn.personDialog = function(prsID, onSaved){
	
		var templates = {
			main: function(){with($H){
				return div({"class":"pnlPersonDialog panel"},
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
				);
			}}
		};
		
		
		function PersonModel(prsID){var _=this;
			var prs = prsID?db.getPerson(prsID):null;
			function prop(nm){return prs?prs[mapping.getJsonAttr(nm)]:"";}
			$.extend(_, {
				id:ko.observable(prs?prsID:null),
				$fio:ko.observable(prop("$fio")).extend({required:"Укажите ФИО"}),
				$post:ko.observable(prop("$post")).extend({required:"Укажите должность"}),
				$inPhone:ko.observable(prop("$inPhone")), //.extend({required:"Укажите внутренний телефон"}),
				$workPhone:ko.observable(prop("$workPhone")), //.extend({required:"Укажите рабочий телефон"}),
				$fax:ko.observable(prop("$fax")), //.extend({required:"Укажите факс"}),
				$mobPhone:ko.observable(prop("$mobPhone")), //.extend({required:"Укажите мобильный телефон"}),
				$email:ko.observable(prop("$email")).extend({requiredEMail:"Укажите электронный адрес"}),
				$roomNr:ko.observable(prop("$roomNr")).extend({required:"Укажите номер комнаты"}),
				$address:ko.observable(prop("$address"))//.extend({required:"Укажите почтовый адрес"})
			});
			
			$.extend(_, {
				existingRow: ko.computed(function(){return _.id()!=null;}, _),
				deletePerson:function(){var _=this;
					if(!confirm("Удалить эту запись?")) return;
					$.post("ws/delPerson.php", {id:_.id(), ticket:$USER.ticket}, function(resp){resp = JSON.parse(resp);
						if(resp.error){
							alert(errors.code[resp.error]);
							return;
						}
						$(".pnlPersonDialog").hide();
						onSaved();
					});
				},
				submitData: function(){var _=this;
					if(!validation.validate(_)) return;
					var res = {id:_.id(), ticket:$USER.ticket};
					res.orgID = $("#out .selOrg").val();
					for(var k in _){
						if(k.slice(0,1)=="$"){
							var attNm = mapping.getJsonAttr(k);
							var val = _[k]();
							res[attNm] = val==null?"":val;
						}
					}
					$("#out .pnlPersonDialog .savingIcon").show();
					$.post(_.id()?"ws/savePerson.php":"ws/addPerson.php", res, function(resp){resp = JSON.parse(resp);
						$("#out .pnlPersonDialog .savingIcon").hide();
						if(resp.error){
							alert(errors.code[resp.error]);
							return;
						}
						$(".pnlPersonDialog").hide();
						onSaved();
					});
				}
			});
		}
		
		
		$(this).each(function(i, el){el=$(el);
			el.html(
				templates.main()
			);
			ko.applyBindings(new PersonModel(prsID), el.find(".pnlPersonDialog")[0]);
		});
	};
});