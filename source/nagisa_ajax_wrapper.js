/*******
* ajax wrapper with default error handling, etc
**************/

N.Ajax = N.Ajax || {};

N.Ajax.makeAjaxCall = function(options) {
	var type = options.type;
	var url = options.url;
	var dataTypeReturned = options.dataTypeReturned || 'json';
	var successHandler = options.successHandler || null;
	var afterSuccessCallback = options.afterSuccessCallback || null;
	var doneCallback = options.doneCallback || null;
	var errorHandler = options.errorHandler || N.defaultAjaxErrorHandler;
	var dataToSend = options.dataToSend || {};
	var jsonToHtmlHandlers = options.jsonToHtmlHandlers || null;  //array of classes
	var dataAgreements = options.dataAgreements || null;

	$.ajax({
		type: type,
		url: url,
		dataType: dataTypeReturned,
		data: dataToSend
	})
	.success(function(data) {
		//if we have one or more agreements about what data was expected from the server,
		//check to see that they have been met
		if (dataAgreements && dataAgreements.length) { 
			var failedAgreements = [];

			_.each(dataAgreements, function(dataAgreement) {
				var agreementResult = N.Agreements.testAgreement(dataAgreement, data).doesAgreementPass;

				if (!agreementResult) {
					failedAgreements.push(dataAgreement.name);
				}
			});

			if (failedAgreements.length) {
				console.error('Agreements failed on JSON call!');
				return;
			}
			else {
				console.log('All agreements passed!');
			}
		}

		if (successHandler) {
			successHandler(data);
		}

		if (jsonToHtmlHandlers) {
			for (var i=0; i<jsonToHtmlHandlers.length; i++) {
				jsonToHtmlHandlers[i].execute(data);
			}
		}

		if (afterSuccessCallback) {
			afterSuccessCallback(data);
		}
	})
	.error(function() {
		errorHandler();
	})
	.done(function() {
		if (doneCallback) {
			doneCallback();
		}
	});
}

/*****************
** SAMPLE:
* N.Ajax.makeAjaxCall({
*	type: 'GET',
* 	url: '/data/test-data.php?page=1',
* successHandler: function(data) { console.log(data) }	
* });
*******/