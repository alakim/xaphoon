// Отображение документа, экспортированного из Excel to ODS в виде иерархии по организациям

define(["jquery", "jqext", "html", "db", "util"], function($, $ext, $H, db, util){
	var templates = {
		main: function(tree, columns){with($H){
			return div(
				apply(tree, function(org){
					return templates.organization(org, 1, columns);
				})
			);
		}},
		organization:function(org, level, columns){with($H){
			var sections = getSections(org);
			return div({"class":"orgPanel"},
				tag("h"+level, [{"class":"orgTitle"}, org.name]),
				div({"class":"orgSubPanel"},
					templates.personsTable(sections.persons, columns),
					apply(sections.organizations, function(org){
						return templates.organization(org, level+1, columns);
					})
				)
			);
		}},
		personsTable: function(persList, colDefs){with($H){
			var columns = getColumns(persList);
			return table({border:1, cellpadding:3, cellspacing:0},
				tr(
					apply(columns, function(v, colID){
						var colDef = colDefs[colID];
						if(!colDef) alert("Column '"+colID+"' not found");
						return th(colDef.name);
					})
				),
				apply(persList, function(pers){
					return tr(
						apply(columns, function(v, colID){
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
		for(var i=0,nd,c=org.xmlchildren; nd=c[i],i<c.length; i++){
			if(nd.xmltype=="organization")
				res.organizations.push(nd);
			else if(nd.xmltype=="person")
				res.persons.push(nd);
		}
		return res;
	}
	
	
	
	return {
		view: function(){
			function display(tree, columns){ 
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
				
				$("#out table").printVersion();
			}
			db.init(function(){
				display(db.getTree(), db.getColumns());
			});
		}
	};
});