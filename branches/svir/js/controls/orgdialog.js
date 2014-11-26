define("controls/orgdialog", [
	"jquery", "html", "knockout", 
	"util", "mapping", "db", "validation"
], function(
	$, $H, ko, 
	util, mapping, db,
	validation
) {
	
	$.fn.orgDialog = function(orgID, onSaved){
	
		var templates = {
			main: function(){with($H){
				return div({"class":"pnlOrgDialog panel"},					h3("Данные организации"),
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
				);
			}}
		};
		
		

	function OrganizationModel(){var _=this;
		var org = orgID?db.getOrganization(orgID):null;
		function prop(nm){return org?org[mapping.getJsonAttr(nm)]:"";}
		$.extend(_, {
			id:ko.observable(org?orgID:null),
			$name:ko.observable(prop("$name")).extend({required:"Укажите название организации"}),
			$workPhone:ko.observable(prop("$workPhone")), //.extend({required:"Укажите рабочий телефон"}),
			$fax:ko.observable(prop("$fax")), //.extend({required:"Укажите факс"}),
			$email:ko.observable(prop("$email")),//.extend({requiredEMail:"Укажите электронный адрес"}),
			$address:ko.observable(prop("$address"))//.extend({required:"Укажите почтовый адрес"})
		});
		$.extend(_, {
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
				$("#out .savingIcon").show();
				$.post("ws/saveOrg.php", res, function(resp){resp = JSON.parse(resp);
					$("#out .savingIcon").hide();
					if(resp.error){
						alert(errors.code[resp.error]);
						return;
					}
					$(".orgDialog").hide();
					onSaved();
				});
			}

		});
	}
		
		
		$(this).each(function(i, el){el=$(el);
			el.html(
				templates.main()
			);
			ko.applyBindings(new OrganizationModel(orgID), el.find(".pnlOrgDialog")[0]);
		});
	};
});