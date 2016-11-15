	var loadDataDefer = $.Deferred();
	dataCenter.initialize(loadDataDefer);
	//universityHistogram.initialize();
	$.when(loadDataDefer)
	.done(function(){
		univSubjHistogram.initialize();
		universityMDS.initialize();
		subjHistogram.initialize();
	})
	.fail(function(){
	});