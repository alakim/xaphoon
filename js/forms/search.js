define(["jquery", "html", "knockout", "db", "util", "validation"], function($, $H, ko, db, util, validation){
	var templates = {
		main: function(){with($H){
			return div(
				div(
					"Искать ",
					select({"data-bind":"value:itemType"},
						option({value:"person"}, "Сотрудника"),
						false?option({value:"organization"}, "Организацию"):null
					)
				),
				div(
					"Поиск по полю: ",
					select({"data-bind":"value:searchField"},
						apply(db.getColumns(), function(col){
							return option({value:col.id}, col.name);
						})
					),
					" искать значение: ",
					input({type:"text", "data-bind":"value:searchString"}),
					input({type:"button", value:"Найти", "data-bind":"click:search"})
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
	
	function Model(){var _=this;
		$.extend(_, {
			itemType: ko.observable("person"),
			searchField: ko.observable("fio"),
			searchString: ko.observable("").extend({required:"Введите строку поиска"})
		});
		$.extend(_, {
			search: function(){
				if(!validation.validate(_)) return;
				var itmType = _.itemType(),
					field = _.searchField(),
					re = new RegExp(_.searchString(), "ig"),
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
		});
	}
	
	
	return {
		view: function(){
			function display(){
				var pnl = $("#out")
				pnl.html(templates.main());
				ko.applyBindings(new Model(), pnl.find("div")[0]);
			}
			db.init(function(){
					display();
			});
		}
	};
});