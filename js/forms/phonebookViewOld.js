// Отображение документа, экспортированного из Excel to ODS в виде иерархии по организациям

define("forms/phonebookViewOld", ["jquery", "html"], function($, $H){
	var templates = {
		main: function(doc){with($H){
			return div(
				div("Организация: ",
					select(
						option({value:0}, "---"),
						apply(doc.organizations, function(org){
							return option({value:org.id}, org.name);
						})
					)
				),
				div({"class":"membersPnl"})
			);
		}},
		members: function(org){with($H){
			return div(
				h2(org.name),
				//console.log(org.members[0]),
				org.members.length?markup(
					table({border:1, cellpadding:3, cellspacing:0},
						org.members[0].cells?markup(
							apply(org.members, function(mbr){
								return tr(
									apply(mbr.cells, function(cell){
										return td(cell);
									})
								)
							})
						):markup(
							tr(
								apply(org.members[0].attrs, function(val, id){
									return id!="num"?th(nameProvider.getName(id)):null;
								})
							),
							apply(org.members, function(mbr){
								if(mbr.cells)return tr(
									td({colspan:mbr.cells.length},
										apply(mbr.cells, function(cell){
											return markup(" ", span(cell));
										})
									)
								);
								return tr(
									apply(org.members[0].attrs, function(val, id){
										return id!="num"?td(
											templates.formatVal(mbr.attrs[id])
										):null;
									})
								)
							})
						)
					)
				):null
			);
		}},
		formatVal: function(val){with($H){
			return !val?""
				:val.match(/@.*\.(ru|com|org)$/i)?a({href:"mailto:"+val}, val)
				:val;
		}}
	};
	
	var rowModes = {
		person:1,
		colNames:2,
		organization:3
	};
	
	function getCells(row){
		var res = {mode:1, values:[], notEmptyValues:[]};
		for(var i=0,c; c=row[i],i<row.length; i++){
			res.values.push(c);
			if(c){
				res.notEmptyValues.push(c);
				if(c.match(/ФИО/))res.mode = rowModes.colNames;
			}
		}
		if(res.notEmptyValues.length==1) res.mode = rowModes.organization;
		return res;
	}
	
	function ColNamesProvider(){
		this.index = {};
		this.list = [];
		this.getID = function(nm){var _=this;
			//if(nm=="№") return;
			var indexed = _.index[nm];
			if(indexed) return indexed.id;
			indexed = {
				id:nm.match(/ФИО/)?"fio"
					:nm.match(/^\s*[№N]\s*$/)?"num"
					:"c"+_.list.length,
				name:nm
			};
			_.index[indexed.id] = indexed;
			_.list.push(indexed);
			return indexed.id;
		};
		this.getName = function(id){
			return this.index[id].name;
		};
		this.setNames = function(){var _=this;
			// for(var i=0,n,c=_.list; n=c[i],i<c.length; i++){
			// 	
			// }
		}
	}
	var nameProvider = new ColNamesProvider();
	
	function getMapping(cells){
		var map = [];
		for(var i=0,f; f=cells[i],i<cells.length; i++){
			if(!f) continue;
			colID = nameProvider.getID(f);
			if(!colID) continue;
			var rule = {title:f, colID:colID};
			map[i] = rule;
		}
		return map;
	}
	
	//var xxCount = 0;
	
	function buildOrganizations(data, doc){
		var org, mapping;
		for(var i=0,r,c=data.rows; r=c[i],i<c.length; i++){
			if(!r) continue;
			var cells = getCells(r);
			
			if(cells.mode==rowModes.colNames){
				mapping = getMapping(cells.values);
			}
			else if(cells.mode==rowModes.organization){
				if(org) {
					doc.organizations.push(org);
					doc.orgIndex[org.id] = org;
				}
				org = {id:"org"+i, name:cells.notEmptyValues[0], members:[]};
			}
			else if(cells.mode==rowModes.person && org){
				var mbr = {org:org.id};
				if(!mapping) mbr.cells = cells.values;
				else{
					mbr.attrs = {};
					$.each(cells.values, function(idx, val){
						var rule = mapping[idx];
						// if(xxCount++<100)
						// 	console.log(idx, rule.colID, val);
						if(!rule) return;
						mbr.attrs[rule.colID] = val;
					});
				}
				org.members.push(mbr);
			}
		}
	}
	
	function prepareDoc(data){
		var doc = {organizations:[], orgIndex:{}};
		buildOrganizations(data, doc);
		nameProvider.setNames();
		return doc;
	}
	
	function showMembers(orgID, doc){
		var org = doc.orgIndex[orgID];
		$(".membersPnl").html(templates.members(org));
	}
	
	return {
		view: function(){
			$.post("ws/phonebook_export.php", {}, function(resp){
				var data = JSON.parse(resp);
				var doc = prepareDoc(data);
				$("#out").html(templates.main(doc));
				$("#out select").change(function(){
					showMembers($(this).val(), doc);
				});
			});
		}
	};
});