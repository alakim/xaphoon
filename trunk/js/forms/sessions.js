define(["jquery", "html", "knockout", "db", "forms/recordView"], function($, $H, ko, db, recordView){

	var templates = {
		main: function(sessions){with($H){
			return div(
				h2("Sessions"),
				table({border:0},
					tr(
						td({width:300, valign:"top"},
							ol(
								apply(sessions, function(ssn){
									return li({"class":"ssnLink", sID:ssn.id},
										ssn.date, ": ", ssn.title
									);
								})
							)
						),
						td({valign:"top"},
							div({id:"ssnPnl"})
						)
					)
				)
			);
		}},
		session: function(ssn){with($H){
			return div(
				h2(ssn.date, ": ", ssn.title),
				apply(ssn.xmlc, function(itm){
					return itm.xmlt=="record"?recordView.template(itm, true):null;
				})
			);
		}}
	};
	
	function viewSession(id){
		var ssn = db.getSession(id);
		$("#ssnPnl").html(templates.session(ssn));
	}
	
	return {
		view: function(pnl){
			pnl = pnl || $(".mainPanel");
			var sessions = db.getSessions();
			pnl.html(templates.main(sessions));
			pnl.find(".ssnLink").css({cursor:"pointer"}).click(function(){
				var sID = $(this).attr("sID");
				viewSession(sID);
			});
		}
	};
});