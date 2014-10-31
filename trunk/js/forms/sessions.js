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
							),
							$STATE.editMode?div({style:"margin:10px 0 10px 20px;"}, input({type:"button", value:"Добавить сессию", "class":"btAddSession"})):null
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
				}),
				$STATE.editMode?div({style:"margin:10px 0 10px 20px;"}, input({type:"button", value:"Редактировать сессию", "class":"btEditSession"})):null
			);
		}},
		sessionDialog: function(){with($H){
			return div(
				table(
					tr(td("Дата"), td(input({type:"text", "data-bind":"$date"}))),
					tr(td("Заголовок"), td(input({type:"text", "data-bind":"$title"})))
				)
			);
		}}
	};
	
	function viewSession(id){
		var ssn = db.getSession(id);
		$("#ssnPnl").html(templates.session(ssn));
		$("#ssnPnl .btEditSession").click(editSession);
	}
	
	function addSession(){
		$("#ssnPnl").html(templates.sessionDialog());
	}
	function editSession(){
		$("#ssnPnl").html(templates.sessionDialog());
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
			pnl.find(".btAddSession").click(addSession);
		}
	};
});