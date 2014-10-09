define(["jquery", "html", "knockout"], function($, $H, ko){

	function template(){with($H){
		return div(
			ul({"class":"menu"},
				li({"data-bind":"click:showProjects"}, "Песни"),
				li({"data-bind":"click:showQueue"}, "Участники"),
				li({"data-bind":"click:showDeadlines"}, "Deadlines")
			)
		);
	}}
	
	
	
	return {
		view: function(pnl){
			pnl.html(template());
		}
	};
});