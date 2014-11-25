define("mapping", [], function() {
	var map2Json = {
		$fio:"fio",
		$name:"name",
		$post:"dolzh",
		$inPhone:"vnutTel",
		$workPhone:"rabTel",
		$fax:"faks",
		$mobPhone:"mobTel",
		$email:"elekAdr",
		$roomNr:"numKomn",
		$address:"potchtAdr",
	};
	
	map2field = {};
	for(var k in map2Json){var v=map2Json[k]; map2field[v]=k;}
	
	return {
		getField: function(attrNm){return map2field[attNm];},
		getJsonAttr: function(fieldNm){return map2Json[fieldNm];}
	};
});