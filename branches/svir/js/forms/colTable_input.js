define("forms/colTable_input", [
	"jquery", "html", "knockout",
	"util", "validation", "errors",
	"textLib", "db",
	"controls/orgtree"
], function(
	$, $H, ko,
	util, validation, errors,
	textLib, db,
	orgTree
){

	var templates = {
		main: function(){with($H){
			return div(
				table(tr(
					td({width:250, valign:"top"},
						textarea({id:"srcText", style:style({width:800, height:300})}),
						div(input({type:"button", value:"Ввод", "class":"btProcess"}))
					),
					td({valign:"top"},
						div({"class":"pnlOrgTree"})
					)
				)),
				div({id:"resultPnl"})
			);
		}},
		table: function(rows){with($H){
			var colDefs = db.getColumns();
			return div(
				table({border:1, cellpadding:3, cellspacing:0},
					tr(
						apply(rows[0], function(c, i){
							return th(
								select(
									option({value:"cmd_Exclude"}, "[исключить]"),
									// option({value:"cmd_CombineLeft"}, "[<< соединить влево]"),
									// option({value:"cmd_CombineRight"}, "[соединить вправо >>]"),
									apply(colDefs, function(cDef){
										return option({value:cDef.id}, cDef.name);
									})
								)
							);
						})
					),
					apply(rows, function(row){
						return tr(
							apply(row, function(col){
								return td(col);
							})
						);
					})
				),
				div(
					input({type:"button", "class":"btSave", value:"Сохранить"}),
					img({src:"images/wait.gif", "class":"pnlWait", style:"display:none;"})
				)
			);
		}}
	};
	
	function getColValues(rows, colIdx){
		var res = [];
		$.each(rows, function(i, row){
			res.push(row[colIdx]);
		});
		//console.log(colIdx, res);
		return res;
	}
	
	function checkType(val){
		if(val.match(/директор|помощник|инженер|секретарь|специалист|программист/i)) return "dolzh";
		if(val.match(/(вич|вна)$/i) && val.split(/\s+/).length==3) return "fio";
		if(val.match(/^\d\d\d\d$/i)) return "vnutTel";
		if(val.match(/\((495|499)\)/) || val.match(/^\d\d\d-\d\d-\d\d$/i)) return "rabTel";
		if(val.match(/\((915|926|905)\)/) || val.match(/^\d\d\d-\d\d-\d\d$/i)) return "mobTel";
		if(val.match(/[a-z0-9\.\_\-]@[a-z0-9\.\_\-]/i)) return "elekAdr";
		if(val.match(/эт\.|каб\. /i)) return "numKomn";
		if(val.match(/Москва|наб\.|ул\./i)) return "potchtAdr";
	}
	
	function suggestType(values){
		//console.log(values);
		var types = {};
		$.each(values, function(i, val){
			if(!val) return;
			var t = checkType(val);
			if(!types[t]) types[t] = 1; else types[t] = types[t]+1;
		});
		var maxCount = 0,
			bestType = null;
		for(var k in types){
			var cnt = types[k];
			if(maxCount<cnt){
				maxCount = cnt;
				bestType = k;
			}
		}
		//console.log(bestType);
		return bestType;
	}
	
	function suggestColumns(rows){
		var selectors = $("#resultPnl select");
		$.each(selectors, function(i, sel){
			var values = getColValues(rows, i);
			var type = suggestType(values);
			$(sel).find("option").each(function(i, opt){opt=$(opt);
				//console.log(opt.attr("value"), type);
				if(opt.attr("value")==type) 
					$(sel).val(type);
					//opt.attr("checked", true);
			});
		});
	}
	
	var docModel = {};
	
	function saveTable(){
		if(!docModel.organization){
			alert("Необходимо выбрать организацию!");
			return;
		}
		var selectors = $("#resultPnl select");
		var cols = [];
		$.each(selectors, function(i, sel){
			cols[i] = $(sel).val();
		});
		docModel.cols = cols;
		docModel.objects = [];
		$.each(docModel.rows, function(ir, row){
			var obj = {}, colsFound = false;
			$.each(row, function(ic, col){
				var aNm = cols[ic];
				if(aNm=="cmd_Exclude") return;
				colsFound = true;
				if(obj[aNm]) obj[aNm]+=" "+col; else obj[aNm] = col;
			});
			if(colsFound) docModel.objects.push(obj);
		});
		var json = JSON.stringify(docModel.objects);
		//alert("Saved!\n to organization:"+docModel.organization+"\n\n"+json);
		$(".pnlWait").show();
		$.post("ws/saveSet.php", {ticket: $USER.ticket, orgID:docModel.organization, persons:json}, function(resp){
			$(".pnlWait").hide();
		});
	}

	function processData(){
		var src = $("#srcText").val();
		var rows = src.split("\n");
		for(var i=0; i<rows.length; i++){
			var row = rows[i];
			var cols = row.split("\t");
			rows[i] = cols;
		}
		docModel.rows = rows;
		$("#resultPnl").html(templates.table(rows));
		$("#resultPnl .btSave").click(saveTable);
		suggestColumns(rows);
	}
	
	
	
	var pnl, ticket;
	
	return {
		view: function(){
			db.init(function(){
				pnl = $("#out");
				ticket = $USER.ticket;
				pnl.html(templates.main());
				pnl.find(".pnlOrgTree").orgTree(function(orgID){
					docModel.organization = orgID;
				});
				pnl.find(".btProcess").click(processData);
			});
		}
	};
});