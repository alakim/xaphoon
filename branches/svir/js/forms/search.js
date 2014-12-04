define("forms/search", ["jquery", "html", "knockout", "db", "util", "validation"], function($, $H, ko, db, util, validation){
	var templates = {
		main: function(){with($H){
			return div(
				div(
					"Искать ",
					select({"class":"selItemType"},
						option({value:"person", selected:true}, "Сотрудника"),
						true?option({value:"organization"}, "Организацию"):null
					)
				),
				div(
					"Поиск по полю: ",
					select({"class":"selSearchField"},
						templates.fieldList("person")
					),
					" искать значение: ",
					input({type:"text", "class":"tbSearchString"})
				),
				div({id:"resPnl"})
			);
		}},
		fieldList: function(iType){with($H){
			var coll = iType=="person"?db.getPersonTypeColumns()
				:iType=="organization"?db.getOrgTypeColumns()
				:null;
			return coll?markup(
				apply(coll, function(fld){
					var colDef = db.getColumns()[fld],
						attr = {value:fld};
					if(fld=="fio" || fld=="name") attr.selected = true;
					return colDef?option(attr, colDef.name):null;
				})
			):null;
		}},
		total: function(count){with($H){
			var last = count%10;
			var tpl = count==0?"Ничего не найдено"
				:count>9&&count<20?"Найдено {0} записей:"
				:last==1?"Найдена {0} запись:"
				:last>1&&last<5?"Найдено {0} записи:"
				:"Найдено {0} записей:";
			return p({style:"font-weight:bold; margin:10px 0 8px 0;"}, format(tpl, count));
		}},
		report: function(res){with($H){
			if(!res.length) return "";
			var columns = db.getColumns();
			return div(
				templates.total(res.length),
				apply(res, function(itm){
					return div(
						div({"class":"title"}, itm.fio || itm.name),
						div({"class":"properties"},
							itm.xmltype=="organization"?div(
								span({"class":"orglink link", orgID:itm.id}, "Показать структуру")
							):null,
							itm.parent?div(
								span({style:"font-weight:bold;"},
									itm.xmltype=="person"?"Организация "
										:itm.xmltype=="organization"?"Вышестоящая организация "
										:null
								),
								span({"class":"link orglink", orgID:itm.parent.id, title:"Показать организацию"}, itm.parent.name)
							):null,
							apply(itm, function(v, k){
								if(k=="xmltype" || k=="xmlchildren" || k=="name" || k=="fio" || k=="parent" || k=="id") return;
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
		
		if(!sStr || !sStr.length){
			$("#resPnl").html("");
			return;
		}
		
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
	
	
	function changeType(){
		var iType = $("#out .selItemType").val();
		$("#out .selSearchField").html(templates.fieldList(iType));
		search();
	}
	
	return {
		view: function(){
			function display(){
				var pnl = $("#out")
				pnl.html(templates.main());
				pnl.find(".tbSearchString").keyup(startSearch);
				pnl.find(".selItemType").click(changeType);
				pnl.find(".selSearchField").click(search);
				// pnl.find(".selSearchField option").each(function(i,el){el=$(el);
				// 	if(el.val()=='fio') el.attr("selected", true);
				// });
			}
			db.init(function(){
					display();
			});
		}
	};
});