﻿define("db", ["jspath", "html", "dataSource", "util"], function($JP, $H, dSrc, util){
	var localDB = {},
		organizations = [],
		persons = [],
		organizationIndex = {},
		personIndex = {},
		personTypeColumns = [],
		orgTypeColumns = [];
	
	
	function indexDB(){
		var pCols = {},
			oCols = {};
		function collectColumns(nd){
			var dict = nd.xmltype=="person"?pCols
				:nd.xmltype=="organization"?oCols
				:null;
			if(!dict)return;
			for(var k in nd){
				dict[k]=true;
			}
		}
		function indexNode(nd, parent){
			collectColumns(nd);
			if(parent) nd.parent = parent;
			if(nd.xmltype=="organization"){
				organizations.push(nd);
				organizationIndex[nd.id] = nd;
			}
			else if(nd.xmltype=="person"){
				persons.push(nd);
				personIndex[nd.id] = nd;
			}
			if(nd.xmlchildren){
				$.each(nd.xmlchildren, function(i, cNd){
					indexNode(cNd, nd);
				});
			}
		}
		$.each(localDB.data.organizations, function(i, org){
			indexNode(org);
		});
		
		personTypeColumns = [];
		for(var k in pCols) personTypeColumns.push(k);
		
		orgTypeColumns = [];
		for(var k in oCols) orgTypeColumns.push(k);
		
	}
	
	return {
		init: function(callback){
			$(".mainPanel").html($H.img({src:"images/wait.gif"}));
			if(localDB.data){
				callback();
				return;
			}
			$.post("ws/phonebook.php", {}, function(resp){
				var data = JSON.parse(resp);
				$(".mainPanel").html("");
				//console.log(data);
				localDB.data = data;
				indexDB();
				callback();
			});
		},
		refresh: function(callback){
			localDB.data = null;
			this.init(callback);
		},
		getTree: function(){return localDB.data.organizations;},
		getColumns: function(){return localDB.data.columns;},
		getOrganization: function(id){return organizationIndex[id];},
		getPerson: function(id){return personIndex[id];},
		getAllOrganizations: function(){return organizations;},
		getAllPersons: function(){return persons;},
		getPersonTypeColumns: function(){return personTypeColumns;},
		getOrgTypeColumns: function(){return orgTypeColumns;}
	};
});