define("jqext", ["jquery", "html"], function($, $H) {
	/******** jQuery Extensions ********/
	
	$.fn.printVersion = function(){
		var templates = {
			button: function(){with($H){
				return input({"class":"btPrint", type:"button", value:"Версия для печати"});
			}},
			window: function(content){with($H){
				return tag("html", markup(
					tag("head",
						tag("title", "Телефонный справочник: версия для печати")
					),
					tag("body",
						table({border:1, cellpadding:3, cellspacing:0}, content)
					)
				))
			}}
		};
		
		$(this).each(function(i, el){el=$(el);
			el.after(templates.button());
			el.next().click(function(){
				var content = el.html();
				var print = window.open();
				var code = templates.window(content);
				print.document.write(code);
				print.document.close();
			});
		});
	};
});