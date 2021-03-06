window.N = window.N || {};
Nagisa = N;
N.Utils = N.Utils || {};
N.Agreements = N.Agreements || {};

N.Agreements.Library = {
	'sample_data_agreement': {
		'objectRoot': {
			path: 'items',
			dataType: 'array',
			dataItemStructure: { //desired structure of one object in this array
        "id": "number",
        "name": "string",
        "image": "string",
        "mock": {
        	"alpha": "array",
        	"beta": "number",
        	"gamma": "string"
        }
	    }
		}
	}
}

N.Agreements.testAgreement = function(agreement, ajaxResult) {
	var failureMessages = [];

	//see if the main data object is where and what it should be
	var rootObject = N.Utils.findObjectAttributeByName(ajaxResult, agreement.objectRoot.path);
	var isRootObjectCorrectType = N.Utils.testDataType(rootObject, agreement.objectRoot.dataType);

	if ( _.isUndefined(rootObject) || !isRootObjectCorrectType ) {
		failureMessages.push('Root object not found at path' + agreement.objectRoot.path + 'or wrong data type');

		return {
			doesAgreementPass: !(failureMessages.length),
			failureMessages: failureMessages
		}
	}

	if (agreement.objectRoot.dataType === 'array' || agreement.objectRoot.dataType === 'object') {
		var i = 0;

		_.each(rootObject, function(rootObjectItem) { //test each one of the data set
			testObjectStructure(rootObjectItem, agreement.objectRoot.dataItemStructure, i);
			i++;
		});	
	}
	//TODO: is else case even necessary???

	console.log('failures:', failureMessages);

	return {
		doesAgreementPass: !(failureMessages.length),
		failureMessages: failureMessages
	}

	//subfunction - called recursively if object
	//TODO: test inside of arrays using mock-sub-objects
	function testObjectStructure(objectToTest, structureToMatch, indexOfItemTested) {
		_.each(structureToMatch, function(dataTypeToMatchOrSubobject, name) {
			if ( _.isObject(dataTypeToMatchOrSubobject) ) { //an actual object, not the name of a data type like others!
				if ( !objectToTest[name] ) { //check if subobject exists
					failureMessages.push('Bad structure: cant find subobject ' + name);
					return;
				}

				testObjectStructure(objectToTest[name], dataTypeToMatchOrSubobject, indexOfItemTested); //will this work on nested objs? maybe
			}
			else {
				var result = N.Utils.testDataType(objectToTest[name], dataTypeToMatchOrSubobject);

				if (!result) {
					failureMessages.push('Bad structure: ' + objectToTest[name] + ' was expected to be: ' + dataTypeToMatchOrSubobject + ' in tested item ' + indexOfItemTested);
				}
			}
		});
	}
}

N.Utils.testDataType = function(dataToTest, dataTypeToMatch) {
 switch (dataTypeToMatch) {
 	case 'string':
 		return _.isString(dataToTest);
 	break;
 	case 'array':
 		return _.isArray(dataToTest);
 	break;
 	case 'object':
 		return _.isObject(dataToTest);
 	break;
 	case 'number':
 		return _.isNumber(dataToTest);
 	break;
 }

}

N.compileTemplate = function(templateName, data, callingMethod, templateLanguage) {
	var templateLanguage = templateLanguage || N.defaultTemplateLanguage;
	var data = data || null;

	try {
		if (templateLanguage == 'underscore') {
			if (data) {
				var templateResult =  _.template($("#" + templateName).html(), data);
			}
			else {
				var templateResult =  _.template($("#" + templateName).html()); //without data, this returns a function, storing the template for later use in a variable
			}
			

		}
    else if (templateLanguage == 'jquery_tmpl') {
      if (data) {
          var templateResult =  $.tmpl($("#" + templateName).html(), data);
      }
      else {
         // var templateResult =  _.template($("#" + templateName).html()); //without data, this returns a function, storing the template for later use in a variable
      }
    }
		//to do: add other deprecated templating languages as needed

    return templateResult;
	}
	catch(e) {
		console.log('the following template error occurred', e);
		console.log('error compiling template named:', templateName, 'with data:', data, 'called from method: ', callingMethod);
	}
};

N.Utils.findObjectAttributeByName = function(objToParse, nameString) {
	var nameArray = nameString.split('.');
	var currentObject = objToParse;

	for (var i=0; i<nameArray.length; i++) {
		
		if (typeof currentObject[nameArray[i]] == 'undefined') {
			currentObject = null;
			break;
		}
		else {
			currentObject = currentObject[nameArray[i]];
		}
	}

	return currentObject;
}