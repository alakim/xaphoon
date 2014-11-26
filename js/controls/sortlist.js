define("controls/sortlist", ["jquery", "html"], function($, $H) {
	
	$.fn.sortList = function(items, options){
		options = $.extend({
			title: null,
			save: function(){},
			openEditor: function(){} // или null, если редактирование запрещено
		}, options);
		
		function changed(pnl, on){
			on = (on==null)||on;
			var bt = pnl.find(".btSaveSorted");
			if(on) bt.show(); else bt.hide();
		}
		
		var templates = {
			main: function(){with($H){
				var mvBtWidth = 80,
					actBtWidth = 190;
				return div(
					options.title?h3(options.title):null,
					table({border:0, cellpadding:10, cellspacing:0}, tr(
						td({valign:"top"},
							ol(
								apply(items, function(el){
									return li({"class":"sortListItem", style:"cursor:pointer;", "elID":el.id}, el.name);
								})
							)
						),
						td(div({"class":"pnlButtons", style:"display:none;"},
							div(input({type:"button", style:style({width:mvBtWidth}), "class":"btSortTop", value:"В начало"})),
							div(input({type:"button", style:style({width:mvBtWidth}), "class":"btSortUp", value:"Вверх"})),
							div(input({type:"button", style:style({width:mvBtWidth}), "class":"btSortDown", value:"Вниз"})),
							div(input({type:"button", style:style({width:mvBtWidth}), "class":"btSortBottom", value:"В конец"}))
						)),
						td(div({"class":"pnlButtons", style:"display:none;"},
							div(input({type:"button", style:style({width:actBtWidth}), "class":"btSortClear", value:"Сбросить выделение"})),
							div(input({type:"button", style:style({width:actBtWidth}), "class":"btSortInvert", value:"Инвертировать выделение"})),
							options.openEditor?div(input({type:"button", style:style({width:actBtWidth}), "class":"btEditElement", value:"Редактировать элемент"})):null
						))
					)),
					div({style:"margin:5px 0 0 20px;"}, 
						table({border:0}, tr(
						td(input({type:"button", value:"Сохранить", "class":"btSaveSorted", style:"display:none;"})),
						td(div({"class":"pnlWait", style:"display:none; width:20px; height:20px;"}))
						))
					)
				);
			}}
		};
		
		function sortTop(pnl){pnl = $(pnl);
			var selected = pnl.find(".selected"),
				list = pnl.find("ol");
			
			selected.detach();
			var tail = list.find(".sortListItem").detach();
			
			list.append(selected);
			list.append(tail);
			changed(pnl);
		}
		
		function sortUp(pnl){pnl = $(pnl);
			var selected = pnl.find(".selected"),
				list = pnl.find("ol"),
				prev = selected.first().prev();
				
			if(!prev.length) return;
			
			selected.detach();
			var tail = prev.prev().length?prev.prev().nextAll().detach():prev.parent().children().detach();
			
			list.append(selected);
			list.append(tail);
			changed(pnl);
		}
		
		function sortDown(pnl){
			var selected = pnl.find(".selected"),
				list = pnl.find("ol"),
				next = selected.last().next();
				
			if(!next.length) return;
			
			selected.detach();
			var tail = next.nextAll().detach();
			
			list.append(selected);
			list.append(tail);
			changed(pnl);
		}
		
		function sortBottom(pnl){
			var selected = pnl.find(".selected"),
				list = pnl.find("ol");
			
			selected.detach();
			list.append(selected);
			changed(pnl);
		}
		
		function clearSelection(pnl){
			pnl.find(".selected").removeClass("selected");
			showButtons(pnl);
		}
		
		function invertSelection(pnl){
			var selected = pnl.find(".selected");
			pnl.find(".sortListItem").addClass("selected");
			selected.removeClass("selected");
			showButtons(pnl);
		}
		
		function openEditor(pnl){
			if(!options.openEditor) return;
			var elID = pnl.find(".selected").attr("elID");
			options.openEditor(elID);
		}
		
		function showButtons(pnl){
			var selCont = pnl.find(".selected").length,
				pnlButtons = pnl.find(".pnlButtons");
			if(selCont>0){
				pnlButtons.show();
				var btEdit = pnl.find(".btEditElement");
				if(selCont==1) btEdit.show(); else btEdit.hide();
			}
			else pnlButtons.hide();
		}
		
		function saveList(pnl){
			function onSaved(){
				el.find(".pnlWait").hide();
			}
			pnl.find(".pnlWait").show();
			var order = [];
			pnl.find(".sortListItem").each(function(i,itm){
				var elID = $(itm).attr("elID");
				order.push(elID);
			});
			options.save(order, onSaved);
		}
		
		
		$(this).each(function(i, el){el=$(el);
			el.html(
				templates.main(items)
			);
			el.find(".sortListItem").click(function(ev){
				var li = $(this),
					cls = "selected",
					grpMode = ev.ctrlKey;
				if(!grpMode) el.find("."+cls).removeClass(cls);
				if(li.hasClass(cls)) li.removeClass(cls); else li.addClass(cls);
				showButtons(el);
			});
			el.find(".btSortTop").click(function(){sortTop(el);});
			el.find(".btSortUp").click(function(){sortUp(el);});
			el.find(".btSortDown").click(function(){sortDown(el);});
			el.find(".btSortBottom").click(function(){sortBottom(el);});
			el.find(".btSortClear").click(function(){clearSelection(el);});
			el.find(".btSortInvert").click(function(){invertSelection(el);});
			el.find(".btEditElement").click(function(){openEditor(el);});
			el.find(".btSaveSorted").click(function(){saveList(el);});
		});
	};
});