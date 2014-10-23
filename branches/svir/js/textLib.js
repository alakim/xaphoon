define(["jquery"], function($){

	function capitalize(str){ 
		var res = [];
		for(var i=0,b; b=str[i],i<str.length; i++){
			res.push(i?b.toLowerCase():b.toUpperCase());
		}
		return res.join("");
	}
	
	var translit = (function(){
		var alph = "а:a,б:b,в:v,г:g,д:d,е:e,ё:jo,ж:zh,з:z,и:i,й:y,к:k,л:l,м:m,н:n,о:o,п:p,р:r,с:s,т:t,у:u,ф:f,х:kh,ц:ts,ч:tch,ш:sh,щ:sch,ъ:,ы:y,ь:,э:e,ю:ju,я:ja,№:num,\":,\':";
		var dict = {};
		$.each(alph.split(","), function(i, rule){
			rule = rule.split(":");
			dict[rule[0]] = rule[1];
		});

		return function(str, maxLng){
			if(!maxLng || maxLng>str.length) maxLng = str.length;
			str = str.toLowerCase();
			var res = [];
			for(var i=0,b; b=str[i],i<maxLng; i++){
				res.push(dict[b] || b);
			}
			return res.join("");
		};
	})();
	
	var badWord = (function(){
		var list = "и,или,а,к,по,на,над";
		var dict = {};
		$.each(list.split(","), function(i, w){
			dict[w] = true;
		});
		return function(word){
			return dict[word];
		};
	})();
	
	function removeLastVowels(str){
		var res = [];
		var consonantFound = false
		for(var i=str.length-1,b; b=str[i],i>=0; i--){
			if(consonantFound)res.push(b);
			else{
				if(b!="a" && b!="e" && b!="i" && b!="o" && b!="u"){
					res.push(b);
					consonantFound = true;
				}
			}
		}
		res = res.reverse();
		return res.join("");
	}
	
	function abbreviation(str){
		str = str.toLowerCase();
		var res = [];
		$.each(str.split(/\s+/), function(i, word){
			if(badWord(word)) return;
			var tr = translit(word, 4);
			if(tr.length>3){
				tr = removeLastVowels(tr);
			}
			if(i) tr = capitalize(tr);
			res.push(tr);
		});
		return res.join("");
	}
	
	function uniqueID(id, dict){
		if(!dict[id]){
			dict[id] = true;
			return id;
		}
		for(var i=1; true; i++){
			id=id+i;
			if(!dict[id]){
				dict[id] = true;
				return id;
			}
		}
	}
	
	function formatHtmlAttr(str){
		return str.replace(/\&/g, "&amp;")
			.replace(/\"/g, "&quot;")
			.replace(/\'/g, "&apos;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/^\s*/g, "")
			.replace(/\s*$/g, "")
			.replace(/\s+/g, " ");
	}
	
	
	return {
		capitalize: capitalize,
		translit: translit,
		abbreviation: abbreviation,
		uniqueID: uniqueID,
		formatHtmlAttr: formatHtmlAttr
	};
});