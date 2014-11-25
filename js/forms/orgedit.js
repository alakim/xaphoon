define("forms/orgedit", [
	"jquery", "html", "knockout", 
	"db", "util", "validation", "errors",
	"controls/orgtree", "controls/sortlist"
], function(
	$, $H, ko, 
	db, util, validation, errors,
	orgTree, sortList
){

	var templates = {
		main: function(permissions){with($H){
			return div(
				table({border:0}, tr(
					td({valign:"top"}, 
						div(
							input({type:"button", value:"Сбросить выделение", "class":"btClearSelectedOrg"}),
							input({type:"button", value:"Создать организацию", "class":"btCreateNew"}),
							input({type:"button", value:"Изменить порядок", "class":"btSort"})
						),
						div({"class":"pnlOrgTree"})
					),
					td({valign:"top"},
						div({"class":"editPnl"}),
						div({"class":"pnlSort", style:"display:none; border:1px solid #ccc; margin:5px; padding:5px;"})
					)
				))
			);
		}},
		orgDialog: function(orgID){with($H){
			return div(
				table({border:1, cellpadding:3, cellspacing:0},
					tr(th({align:"left"}, "ID"), td(input({type:"text", readonly:true, "data-bind":"value:$id"}))),
					tr(
						th({align:"left"}, "Вышестоящая организация"), 
						td(
							div(
								span({"data-bind":"text:superName"}),
								//input({type:"text", readonly:true, "data-bind":"value:superName"}),
								input({type:"button", value:"Выбрать", "data-bind":"click:openSelector"}),
								input({type:"button", value:"Удалить", "data-bind":"click:clearSuper"})
							),
							div({"class":"orgSelector", style:"border:1px solid #ccc;", "data-bind":"visible:selectorMode"},
								div({"class":"pnlOrgTree"})
							)
						)
					),
					tr(th({align:"left"}, "Название"), td(input({type:"text", style:"width:400px;", "data-bind":"value:$name"}))),
					//tr(th({align:"left"}, "Приоритет"), td(input({type:"text", style:"width:400px;", "data-bind":"value:$priority"}))),
					tr(td({colspan:3, align:"center"}, 
						input({type:"button", value:"Ввод", "data-bind":"click:save"}),
						input({type:"button", value:"Удалить", "data-bind":"click:delOrg"}),
						img({"class":"pnlWait", src:"images/wait.gif", style:"display:none;"})
					))
				)
			);
		}}
	};
	
	var pnl, ticket, selectedOrg;
	
	function viewSortDialog(){
		var level = selectedOrg?db.getOrgTree(db.getOrganization(selectedOrg).xmlchildren):db.getOrgTree();
		if(!level.length){
			$(".pnlSort").hide();
			return;
		}
		$(".pnlSort").show().sortList(level, function(order, onSaved){
			var data = {
				id: selectedOrg,
				order: order.join(","),
				ticket: $USER.ticket
			};
			$.post("ws/saveOrgOrder.php", data, function(resp){resp = JSON.parse(resp);
				onSaved();
				$(".pnlSort").hide();
				db.refresh(viewForm);
			});
		});
		
	}
	
	function viewOrgDialog(orgID){
		pnl.find(".editPnl").html(templates.orgDialog(orgID));
		pnl.find(".orgSelector .pnlOrgTree").orgTree("selectSuper", [orgID]);
		ko.applyBindings(new OrgModel(orgID), pnl.find(".editPnl div")[0]);
	}
	
	function OrgModel(orgID){var _=this;
		var org = orgID?db.getOrganization(orgID):null;
		$.extend(_,{
			$id: org?org.id:null,
			$name: ko.observable(org?org.name:""),
			$super: ko.observable(org&&org.parent?org.parent.id:null),
			//$priority: ko.observable(org?org.priority:0),
			selectorMode: ko.observable(false)
		});
		$.extend(_,{
			superName: ko.computed(function(){
				var org = db.getOrganization(_.$super());
				return org?org.name:"";
			}),
			save: function(){
				var data = util.getModelData(_);
				data.ticket = $USER.ticket;
				pnl.find(".pnlWait").show();
				$.post("ws/saveOrgTree.php", data, function(resp){resp = JSON.parse(resp);
					db.refresh(viewForm);
				});
			},
			delOrg: function(){
				if(!confirm("Удалить данную организацию?")) return;
				var data = {id:_.$id, ticket:$USER.ticket};
				pnl.find(".pnlWait").show();
				$.post("ws/delOrgTree.php", data, function(resp){resp = JSON.parse(resp);
					db.refresh(viewForm);
				});
			},
			openSelector: function(){
				this.selectorMode(true);
			},
			selectSuper: function(m, e){
				var orgID = $(e.target).attr("orgID");
				this.$super(orgID);
				this.selectorMode(false);
			},
			clearSuper: function(){
				this.$super(null);
			}
		});
	}
	
	function viewForm(){
		pnl.html(templates.main());
		pnl.find(".pnlOrgTree").orgTree(function(orgID){
			selectedOrg = orgID;
			viewOrgDialog(orgID);
			pnl.find(".pnlSort").hide();
		});
		pnl.find(".btCreateNew").click(function(){
			selectedOrg = null;
			viewOrgDialog();
		});
		pnl.find(".btSort").click(viewSortDialog);
		pnl.find(".btClearSelectedOrg").click(function(){
			selectedOrg = null;
			$(".pnlOrgTree .selected").removeClass("selected");
			pnl.find(".editPnl").html("");
			pnl.find(".pnlSort").hide();
		});
	}
	
	return {
		view: function(){
			pnl = $("#out");
			ticket = $USER.ticket;
			
			db.init(viewForm);
		}
	};
});