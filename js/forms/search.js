define(["jquery", "html", "knockout", "db", "util", "validation"], function($, $H, ko, db, util, validation){
	var templates = {
		main: function(){with($H){
			return div(
				div(
					"Искать ",
					select({"class":"selItemType", "data-bind":"value:itemType"},
						option({value:"person"}, "Сотрудника"),
						false?option({value:"organization"}, "Организацию"):null
					)
				),
				div(
					"Поиск по полю: ",
					select({"class":"selSearchField", "data-bind":"value:searchField"},
						apply(db.getColumns(), function(col){
							return option({value:col.id}, col.name);
						})
					),
					" искать значение: ",
					input({type:"text", "class":"tbSearchString", "data-bind":"value:searchString,event:{keypress:startSearch}"})
				),
				div({id:"resPnl"})
			);
		}},
		report: function(res){with($H){
			var columns = db.getColumns();
			return div(
				p(format("Найдено {0} записей:", res.length)),
				apply(res, function(itm){
					return div(
						div({"class":"title"}, itm.fio || itm.name),
						div({"class":"properties"},
							itm.parent?div(
								span({style:"font-weight:bold;"}, "Организация "),
								span({"class":"link orglink", orgID:itm.parent.id, title:"Показать организацию"}, itm.parent.name)
							):null,
							apply(itm, function(v, k){
								if(k=="xmltype" || k=="xmlchildren" || k=="name" || k=="fio" || k=="parent") return;
								return div(
									span({style:"font-weight:bold;"}, columns[k]?columns[k].name:k),
									" ", util.formatValue(v)
								);
							})
						)
					);
				})
			);
		}}
	};
	
	var keyDelay = (function(){
		var delay = 300,
			collecting = false;
		return function(callback){
			if(!collecting){
				collecting = true;
				setTimeout(function(){
					callback();
					collecting = false;
				}, delay);
			}
		};
	})();
	
	function startSearch(){
		keyDelay(search);
	}
	
	function search(){
		var sStr = $("#out .tbSearchString").val(),
			itmType = $("#out .selItemType").val(),
			field = $("#out .selSearchField").val();
		
		sStr = sStr.replace(/\\/g, "");
		var re = new RegExp(sStr, "ig"),
			res = [];
		var coll = itmType=="organization"?db.getAllOrganizations()
			:itmType=="person"?db.getAllPersons()
			:null;
		if(!coll) alert("Неопределенное множество поиска "+itmType);
		
		$.each(coll, function(i, itm){
			var val = itm[field];
			if(val && val.match(re)) res.push(itm);
		});
		$("#resPnl").html(templates.report(res));
		$("#resPnl div.title").click(function(){
			$(this).parent().find(".properties").slideDown();
		});
		$("#resPnl .orglink").click(function(){
			var orgID = $(this).attr("orgID");
			require("forms/phonebookAccordionView").view(orgID);
		});
	}
	
	return {
		view: function(){
			function display(){
				var pnl = $("#out")
				pnl.html(templates.main());
				pnl.find(".tbSearchString").keyup(startSearch);
				pnl.find(".selItemType").click(search);
				pnl.find(".selSearchField").click(search);
				pnl.find(".selSearchField option").each(function(i,el){el=$(el);
					if(el.val()=='fio') el.attr("selected", true);
				});
			}
			db.init(function(){
					display();
			});
		}
	};
});