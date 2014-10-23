define(["jquery", "html", "knockout", "util", "errors"], function($, $H, ko, util, errors){

	var templates = {
		main: function(){with($H){
			return div(
				p("Верификация данных позволяет выявить и устранить ошибки в БД."),
				div({style:"margin:10px; padding:5px;"},
					input({"class":"btVerify", type:"button", value:'Начать верификацию'}),
					div({"class":"verificationOut", style:style({
						width:800, height:400,
						padding:"5px", "margin-top":"5px",
						"background-color":"#220",
						color:"#eef"
					})})
				)
			);
		}},
		error: function(title, code){with($H){
			return span(
				title, ": ",
				span({style:"color:#f00;"}, "ОШИБКА - ", errors.code[code])
			);
		}},
		okMessage: function(title){with($H){
			return span(title, ": ", span({style:"color:#0f0;"}, "OK"));
		}}
	}
	
	var pnl, ticket;
	
	function log(msg){
		$("#out .verificationOut").append($H.div(msg));
	}
	
	function startVerification(){
		log("Запуск верификации...");
		$.post("ws/verify_identity.php", {ticket:$USER.ticket}, function(resp){resp = JSON.parse(resp);
			var title = "Идентичность";
			if(resp.error)log(templates.error(title, resp.error))
			else{
				if(resp.addedIDs) log(title+" - добавлены идентификаторы: "+resp.addedIDs);
				log(templates.okMessage(title))
			}
			if(resp.errors){
				$.each(resp.errors, function(i, err){
					log(title+" - "+$H.span({style:"color:#f00"}, "Ошибка: ", err));
				});
			}
			log($H.span("Верификация завершена"));
		});

	}
	
	return {
		view: function(){
			pnl = $("#out");
			ticket = $USER.ticket;
			pnl.html(templates.main());
			$("#out .btVerify").click(startVerification);
		}
	};
});