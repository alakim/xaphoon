define("forms/mainMenu", ["jquery", "html", "knockout", "forms/phonebook_simple", "forms/search", "forms/phonebookAccordionView"], function($, $H, ko, phonebook, search, phonebookView){

	function template(){with($H){
		return div(
			ul({"class":"menu"},
				li({"data-bind":"click:search"}, "Поиск"),
				li({"data-bind":"click:showAll"}, "Просмотр")
				//li({"data-bind":"click:showTable"}, "Отладочный просмотр таблицы"),
			)
		);
	}}
	
	function Model(){var _=this;
		_.showAll = function(){
			$("#out").html($H.img({src:"images/wait.gif"}));
			phonebookView.view();
		};
		_.showTable = function(){
			$("#out").html($H.img({src:"images/wait.gif"}));
			phonebook.view();
		};
		_.search = function(){
			$("#out").html($H.img({src:"images/wait.gif"}));
			search.view();
		};
	}
	
	return {
		view: function(pnl){
			pnl.html(template());
			var model = new Model();
			ko.applyBindings(model, pnl.find("div")[0]);
			model.search();
		}
	};
});