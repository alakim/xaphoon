define(["jquery", "html", "knockout", "util", "validation", "errors"], function($, $H, ko, util, validation, errors){

	var templates = {
		main: function(permissions){with($H){
			return div(
				div(
					"Выберите организацию ",
					select({"class":"selOrg"},
						apply(permissions, function(prm){
							return prm.organization?option({value:prm.organization}, organizationIndex.getItem(prm.organization).name):null;
						})
					)
				),
				div({"class":"editPnl"})
			);
		}},
		editPanel: function(orgID){with($H){
			var org = organizationIndex.getItem(orgID);
			return org?div(
				h2(org.name),
				apply(org.xmlchildren, function(el){
					return el.xmltype=="person"?div({"class":"link personEditLink", prsID:el.id}, el.fio):null;
				})
			):null;
		}}
	};
	
	var pnl, ticket;
	
	function viewEditPanel(){
		var orgID = $("#out .selOrg").val();
		$("#out .editPnl").html(templates.editPanel(orgID));
		$("#out .editPnl .personEditLink").click(function(){
			var prsID = $(this).attr("prsID");
			alert(prsID);
		});
	}
	
	var organizationIndex = (function(){
		var index = {};
		return {
			build:function(){
				function indexOrg(org){
					index[org.id] = org;
					if(org.xmlchildren){
						for(var i=0,el,c=org.xmlchildren; el=c[i],i<c.length; i++){
							if(el.xmltype=="organization") indexOrg(el);
						}
					}
				}
				$.each($XMLDB.organizations, function(i, org){
					indexOrg(org);
				});
			},
			getItem: function(orgID){
				return index[orgID];
			}
		};
	})();
	
	function PersonModel(data){var _=this;
		$.extend(_, {
		});
	}
	
	return {
		view: function(){
			pnl = $("#out");
			ticket = $USER.ticket;
			pnl.html(templates.main());


			if(!$XMLDB){
				$.post("ws/phonebook.php", {}, function(resp){
					var data = JSON.parse(resp);
					$XMLDB = data;
					organizationIndex.build();
					$.post("ws/userPermissions.php", {ticket:ticket}, function(resp){
						resp = JSON.parse(resp);
						pnl.html(templates.main(resp));
						viewEditPanel();
						$("#out .selOrg").change(function(){
							viewEditPanel();
						});
					});
				});
			}
		}
	};
});