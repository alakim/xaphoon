define("controls/sortlist", ["jquery", "html"], function($, $H) {
	
	$.fn.sortList = function(items, callback){
		var templates = {
			main: function(){with($H){
				return div(
					table({border:0, cellpadding:10, cellspacing:0}, tr(
						td({valign:"top"},
							ol(
								apply(items, function(el){
									return li({"class":"sortListItem", style:"cursor:pointer;", "elID":el.id}, el.name);
								})
							)
						),
						td(
							div(input({type:"button", style:"width:80px;", "class":"btSortTop", value:"В начало"})),
							div(input({type:"button", style:"width:80px;", "class":"btSortUp", value:"Вверх"})),
							div(input({type:"button", style:"width:80px;", "class":"btSortDown", value:"Вниз"})),
							div(input({type:"button", style:"width:80px;", "class":"btSortBottom", value:"В конец"}))
						),
						td(
							div(input({type:"button", "class":"btSortClear", value:"Сбросить выделение"}))
						)
					)),
					div({style:"margin:5px 0 0 20px;"}, input({type:"button", value:"Сохранить", "class":"btSaveSorted"}))
				);
			}}
		};
		
		function sortTop(pnl){pnl = $(pnl);
			var selected = pnl.find(".selected"),
				list = pnl.find("ol");
			
			selected.detach();
			var tail = list.find(".sortListItem");
			tail.detach();
			
			selected.each(function(i, el){list.append(el);});
			tail.each(function(i, el){list.append(el);});
		}
		
		function sortUp(pnl){pnl = $(pnl);
			var selected = pnl.find(".selected"),
				list = pnl.find("ol");
				
				var prev = selected.first().prev();
				if(!prev.length) return;
				
				selected.detach();
				var tail = prev.prev().length?prev.prev().nextAll().detach():prev.parent().children().detach();
				
				selected.each(function(i, el){list.append(el);});
				tail.each(function(i, el){list.append(el);});
		}
		
		function sortDown(pnl){
			var selected = pnl.find(".selected"),
				list = pnl.find("ol");
				
				var next = selected.last().next();
				if(!next.length) return;
				
				selected.detach();
				var tail = next.nextAll().detach();
				
				selected.each(function(i, el){list.append(el);});
				tail.each(function(i, el){list.append(el);});
		}
		
		function sortBottom(pnl){
			var selected = pnl.find(".selected"),
				list = pnl.find("ol");
			
			selected.detach();
			
			selected.each(function(i, el){list.append(el);});
		}
		
		function clearSelection(pnl){
			pnl.find(".selected").removeClass("selected");
		}
		
		
		$(this).each(function(i, el){el=$(el);
			el.html(
				templates.main(items)
			);
			el.find(".sortListItem").click(function(){
				var el = $(this), cls = "selected";
				if(el.hasClass(cls)) el.removeClass(cls); else el.addClass(cls);
			});
			el.find(".btSortTop").click(function(){sortTop(el);});
			el.find(".btSortUp").click(function(){sortUp(el);});
			el.find(".btSortDown").click(function(){sortDown(el);});
			el.find(".btSortBottom").click(function(){sortBottom(el);});
			el.find(".btSortClear").click(function(){clearSelection(el);});
			el.find(".btSaveSorted").click(function(){
				var order = [];
				el.find(".sortListItem").each(function(i,itm){
					var elID = $(itm).attr("elID");
					order.push(elID);
				});
				callback(order);
			});
		});
	};
});