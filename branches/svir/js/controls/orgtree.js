define("controls/orgtree", ["jquery", "html", "db"], function($, $H, db) {
	
	$.fn.orgTree = function(callback, exceptions){
		var templates = {
			orgTree: function(treeLevel){with($H){
				return ul(
					apply(treeLevel, function(el){
						if(exceptions && exceptions.indexOf(el.id)>=0) return;
						var attr = {orgID:el.id, "class":"orgTreeLink", style:"cursor:pointer;"};
						if(typeof(callback)=="string") attr["data-bind"] = "click:"+callback;
						return li(
							span(attr, el.name),
							el.children?templates.orgTree(el.children):null
						);
					})
				);
			}}
		};
		
		$(this).each(function(i, el){el=$(el);
			el.html(
				templates.orgTree(db.getOrgTree())
			);
			if(typeof(callback)=="function"){
				el.find(".orgTreeLink").click(function(){
					el.find(".orgTreeLink").removeClass("selected");
					$(this).addClass("selected");
					var orgID = $(this).attr("orgID");
					callback(orgID);
				});
			}
		});
	};
});