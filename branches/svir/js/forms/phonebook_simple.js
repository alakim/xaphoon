// Отладочный просмотр XML-данных организаций

define("forms/phonebook_simple", ["jquery", "html"], function($, $H){
	var templates = {
		main: function(doc){with($H){
			return div(
				apply(doc.organizations, function(org){
					return templates.organization(org, doc.columns);
				})
			);
			//return div("SEARCH FORM");
		}},
		organization: function(org, columns){with($H){
			return div(
				org.name,
				div({style:"margin-left:50px;"},
					apply(org.xmlchildren, function(ch){
						return ch.xmltype=="organization"?templates.organization(ch, columns)
							:ch.xmltype=="person"?templates.person(ch, columns)
							:null;
					})
				)
			);
		}},
		person: function(pers, columns){with($H){
			return div(
				pers.fio, " ", 
				apply(pers, function(v, k){
					var nm = columns[k]?columns[k].name:k;
					return k!="xmltype" && k!="fio"?span(", ", nm,": ",v):null;
				})
			);
		}}
	};
	

	
	return {
		view: function(){
			$.post("ws/phonebook.php", {}, function(resp){
				var data = JSON.parse(resp);
				$("#out").html(templates.main(data));
			});
		}
	};
});