// Отображение документа, экспортированного из Excel to ODS в виде единой таблицы

define("forms/phonebookTableView", [
	"jquery", "html", "db", "util",
	"controls/printButton"
], function(
	$, $H, db, util,
	printButton
){
	var templates = {
		main: function(tree, columns){with($H){
			var colCount = 0;
			return div(
				div(
					div(input({"type":"button", "class":"btSelOrg", value:"Выбрать организацию"})),
					div({"class":"orgSelector", style:"display:none;"})
				),
				table({border:1, cellpadding:3, cellspacing:0},
					tr(
						apply(columns, function(col){
							//console.log(col);
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
		
			function display(id){
				//console.log(id);
				var tree = id?[db.getOrganization(id)]:db.getTree();
				$("#out").html(templates.main(tree, db.getColumns()));
				$("#out table").printVersion();
				$("#out .btSelOrg").click(function(){
					var pnl = $("#out .orgSelector");
					if(!pnl.html().length){
						pnl.html(templates.orgSelector());
						pnl.find(".node").click(function(){
							el=$(this);
							var oID = el.attr("orgID");
							pnl.slideUp();
							display(oID);
						});
					}
					pnl.slideDown();
				});
			}
			
			db.init(function(){
				display(orgID);
			});
		}
	};
});