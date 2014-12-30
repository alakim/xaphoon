// Отображение документа, экспортированного из Excel to ODS в виде единой таблицы

define("forms/phonebookTableView", [
	"jquery", "html", "db", "util",
	"controls/printButton"
], function(
	$, $H, db, util,
	printButton
){
	var templates = {
		main: function(){with($H){
			return div(
				div(
					div(input({"type":"button", "class":"btSelOrg", value:"Выбрать организацию"})),
					div({"class":"orgSelector", style:"display:none;"})
				),
				div({"class":"pnlTable"})
			);
		}},
		mainTable: function(tree, columns){with($H){
			var colCount = 0;
			return div(
				tree.length&&tree[0].parent?p(
					{"class":"lnkSuper link", parentID:tree[0].parent.id, style:"margin:5px;"}, 
					"Показать вышестоящую организацию: ", tree[0].parent.name
				):null,
				table({border:1, cellpadding:3, cellspacing:0},
					tr(
						apply(columns, function(col){
							if(col.id=="name") return;
							colCount++;
							return th(col.name);
						})
					),
					apply(tree, function(branch){
						return templates.organization(branch, colCount, columns);
					})
				)
			);
		}},
		organization: function(org, colCount, columns){with($H){
			return markup(
				tr(th({colspan:colCount, align:"left"}, org.name)),
				apply(org.xmlchildren, function(xCh){
					return xCh.xmltype=="organization"? templates.organization(xCh, colCount, columns)
						:templates.person(xCh, columns);
				})
			);
		}},
		person: function(prs, columns){with($H){
			return tr(
				apply(columns, function(col){
					if(col.id=="name") return;
					return td(
						util.formatValue(prs[col.id])
					);
				})
			);
		}},
		orgSelector: function(tree){with($H){
			tree = tree||db.getTree();
			return div(
				div({"class":"node", style:"cursor:pointer;"}, "*** Показать все ***"),
				apply(tree, function(nd){
					return templates.orgSelectorNode(nd);
				})
			);
		}},
		orgSelectorNode: function(node){with($H){
			return div({style:"margin-left:25px;"},
				div({"class":"node", style:"cursor:pointer;", orgID:node.id}, node.name),
				apply(node.xmlchildren, function(xCh){
					return templates.orgSelectorNode(xCh);
				})
			);
		}}
	};
	

	
	
	return {
		view: function(orgID){
		
			function displaySelector(){
				var pnl = $("#out .orgSelector"),
					btn = $("#out .btSelOrg");
				if(!pnl.html().length){
					pnl.html(templates.orgSelector());
					pnl.find(".node").click(function(){
						el=$(this);
						var oID = el.attr("orgID");
						//console.log(oID);
						pnl.slideUp();
						display(oID);
						btn.show();
					});
				}
				pnl.slideDown();
				btn.hide();
			}
		
			function display(id){
				var tree = id?[db.getOrganization(id)]:db.getTree();
				$("#out .pnlTable").html(templates.mainTable(tree, db.getColumns()));
				$("#out table").printVersion();
				$("#out .btSelOrg").click(displaySelector);
				$("#out .pnlTable .lnkSuper").click(function(){
					var parentID = $(this).attr("parentID");
					display(parentID);
				});
			}
			
			db.init(function(){
				$("#out").html(templates.main());
				if(orgID) display(orgID);
				else displaySelector();
			});
		}
	};
});