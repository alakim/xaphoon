// Отображение документа, экспортированного из Excel to ODS в виде иерархии по организациям

define("forms/phonebookAccordionView", [
	"jquery", "html", "db", "util",
	"controls/printButton"
], function(
	$, $H, db, util,
	printButton
){
	var templates = {
		main: function(tree, columns){with($H){
			// var arr = []; for(var k in tree) arr.push(tree[k]);
			// 
			// var sorted = arr.sort(function(n1,n2){
			// 	var p1 = (+n1.priority)||0,
			// 		p2 = (+n2.priority)||0;
			// 	return p1==p2?0:p1<p2?1:-1;
			// });
			return div(
				apply(tree, function(org){
					return templates.organization(org, 1, columns);
				})
			);
		}},
		organization:function(org, level, columns){with($H){
			var sections = getSections(org);
			return div({"class":"orgPanel", orgID:org.id},
				tag("h"+level, [{"class":"orgTitle"}, org.name]),
				div({"class":"orgSubPanel"},
					p({"class":"link lnkTable", orgID:org.id}, "Показать в таблице"),
					templates.personsTable(sections.persons, columns),
					apply(sections.organizations, function(org){
						return templates.organization(org, level+1, columns);
					})
				)
			);
		}},
		personsTable: function(persList, colDefs){with($H){
			if(!persList.length) return;
			var columns = getColumns(persList);
			return table({border:1, cellpadding:3, cellspacing:0},
				tr(
					apply(columns, function(v, colID){
						if(colID=="parent") return;
						var colDef = colDefs[colID];
						if(!colDef) alert("Column '"+colID+"' not found");
						return th(colDef.name);
					})
				),
				apply(persList, function(pers){
					return tr(
						apply(columns, function(v, colID){
							if(colID=="parent") return;
							return td(
								util.formatValue(pers[colID])
							);
						})
					);
				})
			);
		}}
		
	};
	
	function getColumns(persons){
		var res = {};
		$.each(persons, function(i, prs){
			for(var k in prs){
				if(k!="xmltype" && k!="id") res[k]=true;
			}
		});
		return res;
	}
	
	function getSections(org){
		var res = {organizations:[], persons:[]};
		if(org.xmlchildren){
			for(var i=0,nd,c=org.xmlchildren; nd=c[i],i<c.length; i++){
				if(nd.xmltype=="organization")
					res.organizations.push(nd);
				else if(nd.xmltype=="person")
					res.persons.push(nd);
			}
		}
		return res;
	}
	
	// Разворачивает дерево до указанной организации
	function expandTree(orgID){
		$(".orgPanel").each(function(i, pnl){pnl=$(pnl);
			if(pnl.attr("orgID")==orgID){
				pnl.show();
				pnl.find(">.orgSubPanel").show();
				for(var i=0,prt=pnl.parent(); prt.length&&i<1000; prt=prt.parent(),i++){
					prt.show();
				}
				var pos = pnl.position();
				window.scrollTo(0, pos.top);
				pnl.addClass("highlight");
				setTimeout(function(){
					pnl.removeClass("highlight");
				},800);
			}
		});
	}
	
	
	return {
		view: function(orgID){
			function display(tree, columns, orgID){ 
				$("#out").html(templates.main(tree, columns));
				
				$("#out .orgTitle").click(function(){
					$(this).parent().find(">.orgSubPanel").each(function(i, el){el=$(el);
						el.parent().parent().find(".orgSubPanel").hide();
						
						if(el.css("display")=="block")
							el.slideUp();
						else
							el.slideDown();
					});
				});
				$("#out .lnkTable").click(function(){
					var orgID = $(this).attr("orgID");
					require("forms/phonebookTableView").view(orgID);
				});
				
				$("#out table").printVersion();
				if(orgID) expandTree(orgID);
			}
			db.init(function(){
				$(".mainMenu li").removeClass("selected");
				$(".mainMenu .mnTree").addClass("selected");

				display(db.getTree(), db.getColumns(), orgID);
			});
		}
	};
});