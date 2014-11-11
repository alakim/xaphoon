// Отображение документа, экспортированного из Excel to ODS в виде иерархии по организациям

define("forms/phonebookView", ["jquery", "html"], function($, $H){
	var templates = {
		main: function(doc){with($H){
			return div(
				div("Организация: ",
					select({"class":"selOrg"},
						option({value:0}, ""),
						apply(doc.organizations, function(org){
							return option({value:org.id}, org.name);
						})
					)
				),
				div({"class":"membersPnl"})
			);
		}},
		formatVal: function(val){with($H){
			return !val?""
				:val.match(/@.*\.(ru|com|org)$/i)?a({href:"mailto:"+val}, val)
				:val;
		}},
		membersList: function(org, columns){with($H){
			//console.log(org);
			return div(
				table({border:1, cellpadding:3, cellspacing:0},
					tr(
						apply(columns, function(col){
							return th(col.name);
						})
					),
					apply(org.xmlchildren, function(itm){
						return tr(
							apply(columns, function(col){
								return td(
									itm[col.id]
								);
							})
						);
					})
				)
			);
		}}
	};
	
	function showMembers(orgID, doc){
		var org = orgIndex.getItem(orgID);
		$(".membersPnl").html(templates.membersList(org, doc.columns));
	}
	
	var personsIndex = (function(){
		var index = {};
		return {
			build: function(doc){
				
			},
			getPersons: function(orgID){
			}
		};
	})();
	
	var orgIndex = (function(){
		var index = {};
		
		return {
			build: function(doc){
				for(var id in doc.organizations){
					index[id] = doc.organizations[id];
				}
			},
			getItem: function(id){
				return index[id];
			}
		};
	})();
	
	return {
		view: function(){
			function display(doc){
				orgIndex.build(doc);
				personsIndex.build(doc);
				$("#out").html(templates.main(doc));
				$("#out select.selOrg").change(function(){
					showMembers($(this).val(), doc);
				});
			}
			if(!$XMLDB){
				$.post("ws/phonebook.php", {}, function(resp){
					var data = JSON.parse(resp);
					$XMLDB = data;
					display(data);
				});
			}
			else{
				display($XMLDB);
			}
		}
	};
});