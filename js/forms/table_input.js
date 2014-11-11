define("forms/table_input", [
	"jquery", "html", "knockout",
	"util", "validation", "errors",
	"textLib"
], function(
	$, $H, ko,
	util, validation, errors,
	textLib
){

	var templates = {
		main: function(){with($H){
			var fieldStyle = style({width:800, height:400});
			return div(
				div({id:"csvSrc"},
					div(
						textarea({"data-bind":"value:csvSource", style:fieldStyle})
					),
					div(
						input({type:"button", value:"Создать таблицу", "data-bind":"click:parseCsv"})
					)
				),
				div({id:"tblViewPnl", style:"display:none;"},
					div({id:"tblView"}),
					div(
						input({type:"button", value:"Сформировать код XML", "data-bind":"click:buildXml"})
					)
				),
				div({id:"tblXmlPnl", style:"display:none;"},
					textarea({id:"tblXml", style:fieldStyle})
				)
			);
		}},
		tableView: function(doc){with($H){
			return div(
				table({border:1, cellpadding:3, cellspacing:0},
					tr(
						apply(doc.colnames, function(col){
							return th(col.name);
						})
					),
					apply(doc.rows, function(row){
						return tr(
							apply(doc.colnames, function(col){
								return td(
									row[col.id]
								);
							})
						)
					})
				)
			);
		}}
	};
	

	

	
	function getTableArray(src){
		var rows = src.split("\n");
		for(var i=0,r,c=rows; r=c[i],i<c.length; i++){
			c[i] = {
				row: r,
				cells: r.split("\t")
			};
		}
		return rows;
	}
	
	function buildJSONDoc(arr){
		var doc = {colnames:[], rows:[]},
			ids = {};
		$.each(arr, function(rIdx,r){
			if(r.row.match(/ФИО.+телефон/i)){
				$.each(r.cells, function(cIdx, cVal){
					var id = textLib.abbreviation(cVal);
					id = textLib.uniqueID(id, ids);
					cnm = {
						idx:cIdx,
						name:cVal,
						id: id
					};
					doc.colnames.push(cnm);
				});
			}
			else{
				var row = {};
				$.each(r.cells, function(cIdx, cVal){
					if(!(cVal&&cVal.length)) return;
					//console.log(cVal);
					var colID = doc.colnames[cIdx].id;
					row[colID] = cVal;
				});
				doc.rows.push(row);
			}
		});
		return doc;
	}
	
	function buildXmlDoc(jsonDoc){
		var lines = [];
		lines.push("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
		lines.push("<organization>");
		lines.push("\t<columns>");
		$.each(jsonDoc.colnames, function(i, col){
			lines.push($H.format(
				'\t\t<col id="{0}" name="{1}"/>', 
				textLib.formatHtmlAttr(col.id),
				textLib.formatHtmlAttr(col.name)
			));
		});
		lines.push("\t</columns>");
		$.each(jsonDoc.rows, function(i, row){
			var line = ["\t<person "];
			for(var k in row){
				line.push($H.format('{0}="{1}" ', k, textLib.formatHtmlAttr(row[k])));
			}
			line.push("/>");
			lines.push(line.join(""));
		});
		lines.push("</organization>");
		return lines.join("\n");
	}
	
	function Model(){var _=this;
		$.extend(_,{
			csvSource: ko.observable(""),
			jsonDoc: null
		});
		$.extend(_,{
			parseCsv: function(){
				var arr = getTableArray(_.csvSource());
				this.jsonDoc = buildJSONDoc(arr);
				$("#csvSrc").hide();
				$("#tblView").html(templates.tableView(this.jsonDoc));
				$("#tblViewPnl").slideDown();
			},
			buildXml: function(){
				$("#csvSrc").hide();
				$("#tblViewPnl").hide();
				var xmlDoc = buildXmlDoc(this.jsonDoc);
				$("#tblXml").val(xmlDoc);
				$("#tblXmlPnl").slideDown();
			}
		});
	}
	
	var pnl, ticket;
	
	return {
		view: function(){
			pnl = $("#out");
			ticket = $USER.ticket;
			pnl.html(templates.main());
			ko.applyBindings(new Model(), pnl.find("div")[0]);
		}
	};
});