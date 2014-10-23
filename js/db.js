define(["jspath", "dataSource", "util"], function($JP, dSrc, util){
	var localDB = {},
		organizations = [],
		persons = [],
		organizationIndex = {},
		personIndex = {};
	
	
	function indexDB(){
		function indexNode(nd){
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
					indexNode(cNd);
				});
			}
		}
		$.each(localDB.data.organizations, function(i, org){
			indexNode(org);
		});
	}
	
	return {
		init: function(callback){
			if(localDB.data){
				callback();
				return;
			}
			$.post("ws/phonebook.php", {}, function(resp){
				var data = JSON.parse(resp);
				localDB.data = data;
				indexDB();
				callback();
			});
		},
		getTree: function(){
			return localDB.data.organizations;
		},
		getColumns: function(){
			return localDB.data.columns;
		},
		getOrganization: function(id){
			return organizationIndex[id];
		},
		getPerson: function(id){
			return personIndex[id];
		},
		getAllOrganizations: function(){
			return organizations;
		},
		getAllPersons: function(){
			return persons;
		}
	};
});