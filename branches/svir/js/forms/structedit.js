define("forms/structedit", [
	"jquery", "html", "knockout", 
	"db", "util", "validation", "errors",
	"controls/orgtree", "controls/sortlist",
	"controls/orgdialog"
], function(
	$, $H, ko, 
	db, util, validation, errors,
	orgTree, sortList,
	orgDialog
){

	var templates = {
		main: function(){with($H){
			return div({"class":"pnlStruct"},
				table({border:0, cellpadding:3, cellspacing:0}, tr(
					td({valign:"top"},
						div({"class":"pnlOrgTree"})
					),
					td({valign:"top"}, 
						div({"class":"pnlOrgDialog", style:"display:none;"}),
						div({"class":"pnlOrgSort", style:"display:none;"}),
						div({"class":"pnlPersSort", style:"display:none;"})
					)
				))
			);
		}}
	};
	
	var pnl, ticket, selectedOrg;
	
	function viewOrgDialog(orgID){
		pnl.find(".pnlStruct .pnlOrgDialog").show().orgDialog(orgID, updateView);
		
		var level = orgID?db.getOrgTree(db.getOrganization(orgID).xmlchildren):db.getOrgTree();
		if(!level.length){
			$(".pnlOrgSort").hide();
		}
		else{
			pnl.find(".pnlStruct .pnlOrgSort").show().sortList(level, {
				title: "Порядок подчиненных организаций", 
				save: function(order, onSaved){
					onSaved();
				}
			});
		}
		
		var persList = db.getPersons(orgID);
		if(!persList.length)
			$(".pnlPersSort").hide();
		else{
			pnl.find(".pnlStruct .pnlPersSort").show().sortList(persList, {
				title: "Порядок сотрудников",
				save: function(order, onSaved){
					onSaved();
				}
			});
		}
	}
	
	function updateView(){
		db.refresh(viewForm);
	}
	
	function viewForm(){
		pnl.html(templates.main());
		pnl.find(".pnlStruct .pnlOrgTree").orgTree(viewOrgDialog);
	}
	
	return {
		view: function(){
			pnl = $("#out");
			ticket = $USER.ticket;
			db.init(viewForm);
		}
	};
});