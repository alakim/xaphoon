define("validation", ["knockout", "db"], function(ko, db){
	function lambda(expr){
		expr = expr.split("|");
		return new Function(expr[0], "return "+expr[1]);
	}
	
	ko.extenders.requiredEMail = function(target) {
		target.hasError = ko.observable();
		target.validationMessage = ko.observable();
	 
		function validate(newValue) {
			var valid = newValue!=null 
				&& typeof(newValue)=="string" 
				&& newValue.match(/^[a-z0-9\-\_\.]+\@[a-z0-9\-\_\.]+\.[a-z]+$/)!=null;
			
			target.hasError(!valid);
			target.validationMessage(valid ? "" : "Укажите адрес электронной почты");
		}
	 
		validate(target());
		target.subscribe(validate);
		return target;
	}
	
	ko.extenders.uniqueID = function(target, options) {
		target.hasError = ko.observable();
		target.validationMessage = ko.observable();

		var path = typeof(options)=="string"?options:options.path;
		
		var coll = db.getBranch(path);
	 
		function validate(newValue) {
			var valid = (coll==null) || 
				newValue==options.exclude ||
				(newValue && newValue.length && coll[newValue]==null);
			
			target.hasError(!valid);
			target.validationMessage(valid ? "" : "Требуется уникальный идентификатор");
		}
	 
		validate(target());
		target.subscribe(validate);
		return target;
	}
	
	ko.extenders.condition = function(target, options) {
		var cond = typeof(options)=="string"?options:options.condition;
		var overrideMessage = options.message || "Должно выполняться условие "+cond;
		
		cond = lambda(cond);
		target.hasError = ko.observable();
		target.validationMessage = ko.observable();
		
		function validate(newValue) {
			var valid = cond(newValue);
			target.hasError(!valid);
			target.validationMessage(valid ? "" : overrideMessage);
		}

		validate(target());
		target.subscribe(validate);
		return target;
	}
	
	ko.extenders.required = function(target, options) {
		var overrideMessage = typeof(options)=="string"?options:options.message;
		
		target.hasError = ko.observable();
		target.validationMessage = ko.observable();
	 
		function validate(newValue) {
			var valid = newValue!=null && (typeof(newValue)!="string" || newValue.length>0);
			if(valid && options.value!=null){
				valid = newValue==options.value;
			}
			else if(valid && options.equalsField){
				valid = newValue==options.equalsField();
			}
			else  if(valid && options.type=="number"){
				valid = (+newValue).toString()==newValue;
			}
			else {
				if(valid && options.regex)
					valid = (newValue+"").match(options.regex)!=null;
				if(valid && options.condition){
					var cond = lambda(options.condition);
					valid = cond(newValue);
				}
			}
			target.hasError(!valid);
			target.validationMessage(valid ? "" : overrideMessage || "Это поле обязательное.");
		}
	 
		validate(target());
	 
		target.subscribe(validate);
	
		return target;
	};
	
	ko.extenders.checkType = function(target, options) {
		var dataType = typeof(options)=="string"?options:options.type;
		var overrideMessage = options.message || "Type '"+dataType+"' required";
		
		target.hasError = ko.observable();
		target.validationMessage = ko.observable();
	 
		function validate(newValue) {
			var valid = true;
			if(dataType=="date") valid = !newValue || !newValue.length || newValue.match(/^\d\d\d\d-\d\d-\d\d(T\d\d:\d\d)?$/i);
			
			//console.log(dataType, newValue, valid);
			target.hasError(!valid);
			target.validationMessage(valid ? "" : overrideMessage);
		}
	 
		validate(target());
	 
		target.subscribe(validate);
	
		return target;
	};
	
	
	function getMessages(model, level){
		level = level || 0;
		var res = [];
		for(var k in model){
			if(model[k] && model[k].validationMessage){
				var msg = model[k].validationMessage();
				if(msg.length) res.push(msg);
			}
			if(level<3){
				var r1 = getMessages(model[k], level+1);
				if(r1.length) res = res.concat(r1);
			}
		}
		return res;
	}
	
	
	return {
		validate: function(model){
			var valid = getMessages(model);
			if(valid.length){
				alert(valid.join("\n"));
			}
			return valid.length==0;
		}

	};
});