var sample_handler = new N.JsonToHtmlHandler({
	dataPath: 'items',
	domTarget: 'body',
	templateName: 'test_json_template'
});

N.Ajax.makeAjaxCall({
	type: 'GET',
	url: '/data/test-data.php?page=1',
	jsonToHtmlHandlers: [sample_handler]	
});

// $.ajax({
// 	type: "GET",
// 	url: "/data/test-data_1.json",
// 	dataType: 'JSON',
// 	jsonToHtmlHandlers: [sample_handler]
// })
// .success(function(data) {
// 	console.log('yay');
// });

// N.JsonToHtmlHandler = function(params) {
//     this.dataPath = params.dataPath || null;
//     this.domTarget = params.domTarget;
//     this.templateName = params.templateName;
//     this.customJsonHandler = params.customJsonHandler || null;
//     this.afterCompleteCallback = params.afterCompleteCallback || null;
//     this.contentPosition = params.contentPosition || 'append'; // prepend | apppend | replace
// }